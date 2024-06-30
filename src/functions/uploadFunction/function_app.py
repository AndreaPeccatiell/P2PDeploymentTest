import os
import logging
import json
import tempfile
import azure.functions as func
from azure.storage.blob import BlobServiceClient
from PyPDF2 import PdfReader
import fitz  # PyMuPDF

blob_service_client = BlobServiceClient.from_connection_string(os.getenv('AZURE_STORAGE_CONNECTION_STRING'))
container_name = "images"  # Replace with your blob container name

app = func.FunctionApp()

def get_pdf_metadata(file_path):
    try:
        with open(file_path, 'rb') as file:
            reader = PdfReader(file)
            info = reader.metadata
            metadata = {
                'Author': info.get('/Author', None),
                'Creator': info.get('/Creator', None),
                'Producer': info.get('/Producer', None),
                'Subject': info.get('/Subject', None),
                'Title': info.get('/Title', None),
                'CreationDate': info.get('/CreationDate', None),
                'ModDate': info.get('/ModDate', None)
            }
        return metadata
    except Exception as e:
        return {'error': str(e)}

def get_pdf_signatures(file_path):
    signatures = []
    doc = fitz.open(file_path)
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        annot = page.first_annot
        while annot:
            if annot.type[0] == 12:  # 12 is the type for signature fields
                signatures.append({
                    'page': page_num + 1,
                    'rect': annot.rect,
                    'info': annot.info
                })
            annot = annot.next
    return signatures

def upload_to_blob(file, filename):
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=filename)
    blob_client.upload_blob(file, overwrite=True)
    return blob_client.url

@app.function_name(name="UploadFunction")
@app.route(route="UploadFunction", auth_level=func.AuthLevel.ANONYMOUS)
def UploadFunction(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        file = req.files.get('file')
        if not file:
            return func.HttpResponse("No file provided", status_code=400)
        
        filename = file.filename

        # Save the file locally for processing
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            file_data = file.read()
            if not file_data:
                return func.HttpResponse("Empty file", status_code=400)
            temp_file.write(file_data)
            local_path = temp_file.name
        logging.info(f"File saved locally at {local_path}")

        # Process the PDF file
        metadata = get_pdf_metadata(local_path)
        signatures = get_pdf_signatures(local_path)

        # Clean up the local file
        os.remove(local_path)
        logging.info(f"Local file {local_path} removed after processing")

        # Upload file to Azure Blob Storage
        file.seek(0)
        blob_url = upload_to_blob(file, filename)

        response = {
            'metadata': metadata,
            'signatures': signatures,
            'file_path': blob_url
        }

        return func.HttpResponse(json.dumps(response), mimetype="application/json")
    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return func.HttpResponse(f"Error processing request: {e}", status_code=500)
