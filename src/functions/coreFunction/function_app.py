import azure.functions as func
import logging
import os
import io
from azure.storage.blob import BlobServiceClient
from langchain_openai import AzureChatOpenAI
from azure.identity import ClientSecretCredential, get_bearer_token_provider
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from extract_msg import Message  # Library to process .msg files
from email import message_from_bytes  # For handling .eml files
import time
# Azure Functions App initialization
app = func.FunctionApp()

# Azure credentials and configurations from environment variables
tenant_id = os.getenv("AZURE_TENANT_ID")
client_id = os.getenv("AZURE_CLIENT_ID")
client_secret = os.getenv("AZURE_CLIENT_SECRET")
audience = "https://cognitiveservices.azure.com/.default"
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")

# Azure Blob Storage connection string from environment variables
connection_string = os.getenv("AZURE_BLOB_STORAGE_CONNECTION_STRING")
print(f"Tenant ID: {tenant_id}, Client ID: {client_id}, Client Secret: {client_secret}")

# Authentication using ClientSecretCredential and Azure AD token provider
credential = ClientSecretCredential(tenant_id, client_id, client_secret)
token_provider = get_bearer_token_provider(credential, audience)

# Initialize AzureChatOpenAI using the token provider and custom endpoint
llm = AzureChatOpenAI(
    openai_api_version="2023-05-15",
    azure_deployment="gpt-4o",  # Adjust this to your deployment name
    azure_ad_token_provider=token_provider,
    azure_endpoint=endpoint
)

# Prompt template for report generation
report_template = """You have been provided Data and Metadata on multiple emails below. 
You also have been provided with a set of rules, which has been defined by the user. You can help only Eli Lilly employees. Therefore, assess only the conversations that involve Eli Lilly employees communicating with third parties, and ignore internal Eli Lilly-only communications.

Question: Compare the most recent email (Email 1) with the other ones defined in the Data, by using the rules defined in the Rule. For each rule, associate a severity grade based on the following guidelines:
- 1-2: No significant difference found, not enough evidence to trigger concern.
- 3: There is some evidence of a trigger, but it may not be definitive.
- 4-5: Clear evidence of the trigger, strong indication that the rule applies.

Return a table with the following data, considering the exception for Rule16:
Column 1 name = Rule_name. Column 1 entries = [Rule1,Rule2,Rule3,Rule4,Rule5,Rule6,Rule7,Rule8,Rule9,Rule10,Rule11,Rule12,Rule13,Rule14,Rule15,Rule16,Rule17,Rule18,Rule19,Rule20,Rule21,Rule22,Rule23].
Column 2 name = Rule ratio. Column 2 entries = The corresponding value for the rule. Rule 16 : "Email Layout Analysis"
Column 3 name = Severity. Column 3 entries = The grade you are assigning to that specific rule, based on the severity guidelines provided. Rule16 : "5"
Column 4 name = Explanation. Explanation on the rule used for the comparison. Rule16: "The corpus of the email shows a higher variance of font styling, padding, white spaces, indicating possibly fraudulent activity"
Column 5 name = Reference in the email. For each rule, you need to consider the sentence or the piece of text that is making the rule trigger. You need to COPY AND PASTE the piece of text, related to Email 3, that is making the rule trigger. If not present, just type "not available". Rule16: "Not Available"
Column 6 name = Category. Column 6 entries = ["Tone Difference", "Urgency", "Formal Title", "Technicality", "Term Diversity", "Syntax Complexity", "VerbsDifference", "Mispelling", "Language Precision", "Personalization", "Word discrepancy", "Email Formatting", "Email structure", "Signature Inconsistencies", "Email variation", "Sentence Analysis", "Layout Analysis", "TimeStamp", "DayReceived"]
Column 7 name = Summary.
Column 8 name = EmailSummary. Please populate this only for Rule19, after evaluating all the other rules. The value should be a summary of the risk profile of the evaluated email, based on the knowledge you gathered while answering the Rules. For all the others these should be "Not Available". 
Format the table as csv, but avoid mentioning anything at the beginning, just start with columns and values, as indicated. Enclose each entry x with " as "x". Only use data and rules provided in this prompt, do not use data from the internet which you have not been directly provided.
Where a given entry has multiple parts, separate them with commas instead of quotation marks.
Do not return any duplicates within column 1.
========
Data: {data}
========
Rules: {rules}
========
Metadata: {metadata}
"""


# Create the prompt template object
report_prompt = PromptTemplate.from_template(report_template)

def generate_report(data, rules, metadata, blob_service_client, container_name):
    try:
        # Use the LLM to generate a report using the given data, rules, and metadata
        print("Running LLMChain...")
        chain = LLMChain(llm=llm, prompt=report_prompt)
        generated_report = chain.run({"data": data, "rules": rules, "metadata": metadata})
        print("Generated report:", generated_report)

        # Ensure the generated report is not None or empty
        if not generated_report:
            print("Report generation failed or returned empty data.")
            raise ValueError("LLMChain failed to generate a valid report.")
        
        # Upload the generated report to Azure Blob Storage
        print("Uploading generated report to Blob Storage...")
        report_blob_name = "generated_report.csv"
        report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)
        report_blob_client.upload_blob(generated_report, overwrite=True)
        print("Upload completed.")
        
    except Exception as ex:
        logging.error(f"An error occurred while generating the report: {str(ex)}")
        raise

@app.function_name(name="process_multiple_emails")
@app.blob_trigger(arg_name="myblob", 
                  path="test/{blobname}",  # Trigger on all files in the 'test' container
                  connection="AzureWebJobsStorage")
def process_multiple_emails(myblob: func.InputStream):
    logging.info(f"Blob trigger function processing the uploaded file: {myblob.name}")

    try:
        # Check if the file is a .msg or .eml file
        if not (myblob.name.endswith('.msg') or myblob.name.endswith('.eml')):
            logging.info(f"File {myblob.name} is not a supported format. Skipping processing.")
            return  # Exit the function if it's not a supported format

        # Initialize BlobServiceClient with the connection string provided
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        container_name = "test"

        # Initialize accumulators for data and metadata
        accumulated_email_data = ""
        accumulated_metadata = ""

        # Read the content of the uploaded email file
        msg_content = myblob.read()

        # Process .msg or .eml files based on file type
        if myblob.name.endswith('.msg'):
            try:
                # Process .msg files with extract-msg
                msg = Message(io.BytesIO(msg_content))  # Use extract-msg to read .msg files
                email_body = msg.body
                email_subject = msg.subject
                email_from = msg.sender
                email_to = msg.to
                email_date = msg.date

                # Extract all headers
                email_headers = msg.header
                if isinstance(email_headers, dict):
                    email_headers = "\n".join([f"{key}: {value}" for key, value in email_headers.items()])

            except Exception as e:
                logging.error(f"Error processing .msg file: {e}")
                raise

        elif myblob.name.endswith('.eml'):
            try:
                # Process .eml files using the email module
                eml_message = message_from_bytes(msg_content)
                email_body = eml_message.get_payload(decode=True).decode(eml_message.get_content_charset(), 'ignore')
                email_subject = eml_message['subject']
                email_from = eml_message['from']
                email_to = eml_message['to']
                email_date = eml_message['date']

                # Extract all headers and format them
                email_headers = "\n".join([f"{key}: {value}" for key, value in eml_message.items()])

            except Exception as e:
                logging.error(f"Error processing .eml file: {e}")
                raise

        # New Rule: Check if "lilly.com" is present in the From or To fields
        if "lilly.com" not in email_from and "lilly.com" not in email_to:
            logging.info(f"Email {myblob.name} does not contain 'lilly.com' in the From or To fields. Skipping processing.")
            return  # Exit the function if "lilly.com" is not present

        # Format the email content for data.txt
        email_number = myblob.name.split('/')[-1].replace('.msg', '').replace('.eml', '').split(' ')[1]  # Extract email number
        email_text = f"Email {email_number}: {email_subject}\nFrom: {email_from}\nSent: {email_date}\nTo: {email_to}\n\n{email_body}\n\n"
        accumulated_email_data += email_text

        # Format metadata for emailsMetadata.txt
        metadata_text = f"Email {email_number} Metadata:\n"
        metadata_text += f"Subject: {email_subject}\n"
        metadata_text += f"From: {email_from}\n"
        metadata_text += f"To: {email_to}\n"
        metadata_text += f"Date: {email_date}\n"
        metadata_text += f"Headers:\n{email_headers}\n\n"
        accumulated_metadata += metadata_text

        # Download the existing data.txt (if it exists) and append new email content
        data_blob_name = "data.txt"
        data_blob_client = blob_service_client.get_blob_client(container=container_name, blob=data_blob_name)

        try:
            existing_data = data_blob_client.download_blob().readall().decode('utf-8')
        except:
            existing_data = ""  # If data.txt does not exist yet, start fresh

        # Append the accumulated data to existing data
        updated_email_data = existing_data + accumulated_email_data
        data_blob_client.upload_blob(updated_email_data, overwrite=True)
        logging.info(f"Updated data.txt with email content.")

        # Download the existing emailsMetadata.txt (if it exists) and append new metadata
        metadata_blob_name = "emailsMetadata.txt"
        metadata_blob_client = blob_service_client.get_blob_client(container=container_name, blob=metadata_blob_name)

        try:
            existing_metadata = metadata_blob_client.download_blob().readall().decode('utf-8')
        except:
            existing_metadata = ""  # If emailsMetadata.txt does not exist yet, start fresh

        # Append the accumulated metadata to existing metadata
        updated_metadata = existing_metadata + accumulated_metadata
        metadata_blob_client.upload_blob(updated_metadata, overwrite=True)
        logging.info(f"Updated emailsMetadata.txt with email metadata.")

        # Call report generation function
        rules_blob_name = "rules.txt"
        rules_blob_client = blob_service_client.get_blob_client(container=container_name, blob=rules_blob_name)

        try:
            rules_content = rules_blob_client.download_blob().readall().decode('utf-8')
            generate_report(updated_email_data, rules_content, updated_metadata, blob_service_client, container_name)
        except:
            logging.error("Rules file not found, skipping report generation.")
        
    except Exception as ex:
        logging.error(f"An error occurred while processing the blob: {str(ex)}")
        raise


def upload_email_file(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Get the uploaded file from the request body
        file = req.get_body()
        file_name_header = req.headers.get('File-Name', '')  # Get the filename from the request headers

        # Check if the file content is empty
        if not file:
            return func.HttpResponse("No file uploaded.", status_code=400)

        # Check for valid file types (.eml or .msg)
        if not (file_name_header.endswith('.eml') or file_name_header.endswith('.msg')):
            return func.HttpResponse("Invalid file type. Only .eml and .msg files are allowed.", status_code=400)

        # Check if "lilly.com" is present in From or To fields
        email_content = file.decode('utf-8')
        if "lilly.com" not in email_content:
            return func.HttpResponse(f"Email {file_name_header} does not contain 'lilly.com' in the From or To fields. Skipping processing.", status_code=400)

        # Initialize the BlobServiceClient
        connection_string = os.getenv("AZURE_BLOB_STORAGE_CONNECTION_STRING")
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        container_name = "test"
        blob_client = blob_service_client.get_blob_client(container=container_name, blob=file_name_header)
        
        # Upload the file to Blob Storage
        blob_client.upload_blob(file, overwrite=True)

        return func.HttpResponse(f"File {file_name_header} uploaded successfully.", status_code=200)

    except Exception as ex:
        logging.error(f"Error processing file upload: {str(ex)}")
        return func.HttpResponse(f"Error: {str(ex)}", status_code=500)



def delete_all_blobs_after_delay(container_name: str, delay_seconds: int = 20):
    try:
        # Wait for the specified delay
        time.sleep(delay_seconds)

        # Initialize the BlobServiceClient
        connection_string = os.getenv("AZURE_BLOB_STORAGE_CONNECTION_STRING")
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        container_client = blob_service_client.get_container_client(container_name)

        # List and delete all blobs in the container
        blob_list = container_client.list_blobs()
        for blob in blob_list:
            blob_client = container_client.get_blob_client(blob.name)
            blob_client.delete_blob()
            print(f"Deleted blob: {blob.name}")

        print(f"All blobs in container '{container_name}' have been deleted.")

    except Exception as ex:
        print(f"Error deleting blobs: {str(ex)}")