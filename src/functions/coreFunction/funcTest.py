import azure.functions as func
import logging
import os
from io import BytesIO
from function_app import upload_email_file,delete_all_blobs_after_delay,generate_report
from unittest.mock import patch, MagicMock
from azure.storage.blob import BlobServiceClient


def test_upload_invalid_file_type():
    # Simulate an upload request with an invalid file type
    invalid_file_content = b"dummy text content"  # Representing the content of an invalid file
    req = func.HttpRequest(
        method="POST",
        url="/uploadEmail",
        headers={'File-Name': 'invalid_file.txt'},  # Simulate sending an invalid filename
        body=invalid_file_content
    )

    # Call the function
    response = upload_email_file(req)

    # Assert the response indicates the file type is invalid
    assert response.status_code == 400
    assert "Invalid file type. Only .eml and .msg files are allowed." in response.get_body().decode()


def test_upload_empty_file():
    # Simulate an upload request with an empty file
    req = func.HttpRequest(
        method="POST",
        url="/uploadEmail",
        headers={},
        body=b""  # Empty body
    )

    # Call the function
    response = upload_email_file(req)

    # Assert the response indicates no file was uploaded
    assert response.status_code == 400
    assert "No file uploaded." in response.get_body().decode()

def test_upload_malformed_request():
    # Simulate an upload request with malformed data (no file)
    req = func.HttpRequest(
        method="POST",
        url="/uploadEmail",
        headers={},
        body=None  # No body
    )

    # Call the function
    response = upload_email_file(req)

    # Assert the response indicates no file was uploaded
    assert response.status_code == 400
    assert "No file uploaded." in response.get_body().decode()

import time
import pytest
import azure.functions as func
from azure.storage.blob import BlobServiceClient

# Assume you have a function to upload emails already defined

def upload_email_to_blob(file_name, file_content):
    connection_string = os.getenv("AZURE_BLOB_STORAGE_CONNECTION_STRING")
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_name = "test"
    
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=file_name)
    blob_client.upload_blob(file_content, overwrite=True)


def test_file_retention_policy_with_deletion():
    # Step 1: Upload a test file
    test_file_name = "test_email.eml"
    test_file_content = b"dummy email content"
    
    upload_email_to_blob(test_file_name, test_file_content)

    # Step 2: Call the delete_all_blobs_after_delay to delete the file after 20 seconds
    delete_all_blobs_after_delay(container_name="test", delay_seconds=20)

    # Step 3: Verify the file is deleted or inaccessible
    blob_service_client = BlobServiceClient.from_connection_string(os.getenv("AZURE_BLOB_STORAGE_CONNECTION_STRING"))
    container_name = "test"
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=test_file_name)

    try:
        # Try to download the blob
        blob_client.download_blob().readall()
        assert False, "The file should have been deleted but was found."
    except Exception as ex:
        # If an exception is raised, the blob is likely deleted
        assert "NotFound" in str(ex), "The expected exception for a deleted file was not raised."



def test_excel_creation():
    # Initialize BlobServiceClient with real connection string
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # Read real data from the dummySamples folder
    with open('dummySamples/data.txt', 'r') as data_file:
        data = data_file.read()

    with open('dummySamples/rules.txt', 'r') as rules_file:
        rules = rules_file.read()

    with open('dummySamples/metadata.txt', 'r') as metadata_file:
        metadata = metadata_file.read()

    container_name = "test"

    # Call the generate_report function with real data
    print("Calling generate_report with real Blob Storage connection for excel creation...")
    generate_report(data, rules, metadata, blob_service_client, container_name)
    print("generate_report completed.")

    # Verify the report was uploaded to the blob storage
    report_blob_name = "generated_report.csv"
    report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)

    try:
        # Download the uploaded report to validate its content
        report_content = report_blob_client.download_blob().readall().decode('utf-8')
        assert "Rule_name" in report_content  # Checking for a header
        print("Test passed. The report contains correct data.")

    except Exception as ex:
        print(f"Error downloading the blob or validating content: {str(ex)}")
        assert False, "Failed to find the uploaded report or validate its content."





# New test for evaluating rules
@patch('langchain.chains.LLMChain.run')
def test_rules_evaluation(mock_llm_chain_run):
    # Mock the LLMChain to return expected CSV-like output
    mock_llm_chain_run.return_value = """Rule_name, Rule ratio, Severity, Explanation, Reference in the email, Category, Summary, EmailSummary
"Rule1", "1", "5", "Some explanation", "Some reference", "Tone Difference", "Some summary", "Not Available"
"Rule2", "1", "5", "Some explanation", "Some reference", "Urgency", "Some summary", "Not Available"
"""

    mock_blob_service_client = MagicMock()
    data = "Some email data"
    rules = "Rule1, Rule2"
    metadata = "Some metadata"
    container_name = "test"
    
    # Call the generate_report function to process the data
    generate_report(data, rules, metadata, mock_blob_service_client, container_name)

    # Verify that the mock LLM was called to evaluate the rules
    mock_llm_chain_run.assert_called_once()

    # Verify the generated content includes all rules and severity
    generated_content = mock_blob_service_client.get_blob_client().upload_blob.call_args[0][0]
    assert "Rule1" in generated_content
    assert "Rule2" in generated_content
    assert "Severity" in generated_content  # Check if severity column exists


def test_email_rejected_without_lilly_com():
    # Initialize BlobServiceClient with real connection string
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # Simulate an email without "lilly.com" in From and To fields
    email_content = """Subject: Important Notice
    From: john.doe@example.com
    To: jane.smith@otherdomain.com
    Date: Mon, 21 Sep 2024 14:55:02 +0000

    This is a test email.
    """

    # Add email headers without "lilly.com"
    req = func.HttpRequest(
        method="POST",
        url="/uploadEmail",
        headers={'File-Name': 'invalid_email.eml'},
        body=email_content.encode()
    )

    # Call the upload_email_file function to process the email
    print("Calling upload_email_file to test rejection of invalid email...")
    response = upload_email_file(req)
    print(f"Upload response: {response.get_body().decode('utf-8')}")

    # Check if the email was rejected properly based on not containing "lilly.com"
    assert response.status_code == 400
    assert "does not contain 'lilly.com' in the From or To fields" in response.get_body().decode('utf-8')
    print("Test passed for 'lilly.com' rejection.")




import csv
import os
import pytest

def test_check_all_rules_in_report():
    # Read the rules from the rules.txt file
    rules_file_path = 'dummySamples/rules.txt'
    with open(rules_file_path, 'r') as rules_file:
        rules = rules_file.readlines()

    # Expected rule names in the generated report (e.g., Rule1, Rule2, etc.)
    expected_rule_names = [f"Rule{i+1}" for i in range(len(rules))]

    # Path to the generated report
    report_file_path = 'dummySamples/generated_report.csv'

    # Read the generated report and check Rule_name column
    with open(report_file_path, 'r') as report_file:
        csv_reader = csv.DictReader(report_file)
        rule_names_in_report = [row['Rule_name'] for row in csv_reader]

    # Check if all expected rule names are in the report
    for expected_rule in expected_rule_names:
        assert expected_rule in rule_names_in_report, f"{expected_rule} not found in the report"


def test_validate_report_structure():
    # Path to the generated report
    report_file_path = 'dummySamples/generated_report.csv'

    # Expected column headers in the report
    expected_columns = [
        "Rule_name", "Rule ratio", "Severity", "Explanation", 
        "Reference in the email", "Category", "Summary", "EmailSummary"
    ]

    # Read the generated report
    with open(report_file_path, 'r') as report_file:
        csv_reader = csv.DictReader(report_file)

        # Validate the columns in the report
        assert csv_reader.fieldnames == expected_columns, "Report does not have the expected columns"

        # Validate that the severity values are between 1 and 5
        for row in csv_reader:
            severity = int(row['Severity'])
            assert 1 <= severity <= 5, f"Severity {severity} is out of the expected range (1-5)"

import os
import pytest
from azure.storage.blob import BlobServiceClient
from function_app import generate_report

# Use real Azure Blob Storage connection
connection_string = os.getenv("AZURE_BLOB_STORAGE_CONNECTION_STRING")
container_name = "test"  # Make sure this container exists in your Blob Storage account


def test_tone_difference_rule():
    # Initialize BlobServiceClient with real connection string
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    
    # Define two emails with different emotional tones (friendly vs. professional)
    email_data = """
    Email 1:
    From: sender1@lilly.com
    To: recipient1@thirdparty.com
    Subject: Friendly Email
    Body: Hey there! I hope you're doing great. Let's catch up soon. Best, Sender 1.

    Email 2:
    From: sender2@lilly.com
    To: recipient2@thirdparty.com
    Subject: Professional Email
    Body: Dear Sir/Madam, I trust this email finds you well. Kindly provide the requested documents at your earliest convenience. Sincerely, Sender 2.
    """

    # Load the rules for evaluating the tone difference
    rules = """
    Rule 1: Evaluate the differences in the emotional tone used between emails (e.g., professional, friendly).
    """

    # Mock metadata for emails
    metadata = "Some metadata"

    # Call the generate_report function to generate the report
    print("Calling generate_report with real Blob Storage connection...")
    generate_report(email_data, rules, metadata, blob_service_client, container_name)
    print("generate_report completed.")

    # Verify the report was uploaded to the blob storage
    report_blob_name = "generated_report.csv"
    report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)    

    try:
        # Download the uploaded report to validate its content
        report_content = report_blob_client.download_blob().readall().decode('utf-8')
        
        # Print the report content for debugging
        print("Generated report content:")
        print(report_content)

        # Assert the basic structure and rule name is in the report
        assert "Rule1" in report_content
        assert "Tone Difference" in report_content
        
        # Friendly tone example
        assert "Hey there!" in report_content
        
        # Check for professional tone, but be flexible on exact wording if necessary
        assert "formal" in report_content or "professional" in report_content
        
        # Ensure the severity is correctly scored (1-5 scale)
        assert any(severity in report_content for severity in ["3", "4", "5"])  # Expect evidence or clear tone difference
        print("Test passed. The report contains correct data.")

    except Exception as ex:
        print(f"Error downloading the blob or validating content: {str(ex)}")
        assert False, "Failed to find the uploaded report or validate its content."

# Run the test
if __name__ == "__main__":
    pytest.main(["-s", __file__])


def test_rule_18_email_time_delivery():
    # Initialize BlobServiceClient with real connection string
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # Define emails with different delivery times (within and outside business hours)
    email_data = """
    Email 1:
    From: sender1@lilly.com
    To: recipient1@thirdparty.com
    Subject: Early Morning Email
    Body: This email was sent at 3:00 AM.

    Email 2:
    From: sender2@lilly.com
    To: recipient2@thirdparty.com
    Subject: Business Hour Email
    Body: This email was sent at 3:00 PM.
    """

    # Load the rule for checking the time of email delivery
    rules = """
    Rule 18: Check the time emails were delivered. If the email is sent outside business hours (8 am - 7 pm), flag it as risky.
    """

    # Mock metadata for emails
    metadata = """
    Email 1 Metadata:
    Date: 2024-10-23 03:00:00

    Email 2 Metadata:
    Date: 2024-10-23 15:00:00
    """

    # Call the generate_report function to generate the report
    print("Calling generate_report with Rule 18...")
    generate_report(email_data, rules, metadata, blob_service_client, container_name)
    print("generate_report completed.")

    # Verify the report was uploaded to the blob storage
    report_blob_name = "generated_report.csv"
    report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)

    try:
        # Download the uploaded report to validate its content
        report_content = report_blob_client.download_blob().readall().decode('utf-8')

        # Print the report content for debugging
        print("Generated report content:")
        print(report_content)

        # Assert the Rule 18 entry exists and is flagged with severity between 3 and 5 for risky emails
        assert "Rule18" in report_content
        assert any(severity in report_content for severity in ["3", "4", "5"])  # Severity for risky emails (outside business hours)
        assert "3:00 AM" in report_content


        print("Test passed for Rule 18.")

    except Exception as ex:
        print(f"Error downloading the blob or validating content: {str(ex)}")
        assert False, "Failed to validate the content for Rule 18."



def test_rule_11_name_discrepancies():
    # Initialize BlobServiceClient with real connection string
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # Define emails with discrepancies in spelling of names
    email_data = """
    Email 1:
    From: sender1@lilly.com
    To: recipient1@thirdparty.com
    Subject: Email with Name Discrepancy
    Body: Hello Jon Doe, this is a test email from your client "Lylly Inc."

    Email 2:
    From: sender2@lilly.com
    To: recipient2@thirdparty.com
    Subject: Correct Name Email
    Body: Hello John Doe, this is a test email from your client "Lilly Inc."
    """

    # Load the rule for checking discrepancies in names or spelling
    rules = """
    Rule 11: Check for discrepancies in the spelling or use of personal/company names.
    """

    # Mock metadata for emails
    metadata = "Some metadata"

    # Call the generate_report function to generate the report
    print("Calling generate_report with Rule 11...")
    generate_report(email_data, rules, metadata, blob_service_client, container_name)
    print("generate_report completed.")

    # Verify the report was uploaded to the blob storage
    report_blob_name = "generated_report.csv"
    report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)

    try:
        # Download the uploaded report to validate its content
        report_content = report_blob_client.download_blob().readall().decode('utf-8')

        # Print the report content for debugging
        print("Generated report content:")
        print(report_content)

        # Assert Rule 11 entry exists and detects name discrepancies
        assert "Rule11" in report_content
        assert "Jon Doe" in report_content  # Discrepancy in first name
        assert "Lylly Inc." in report_content  # Discrepancy in company name
        assert any(severity in report_content for severity in ["3", "4", "5"]), "Expected severity to be 3, 4, or 5"


        print("Test passed for Rule 11.")

    except Exception as ex:
        print(f"Error downloading the blob or validating content: {str(ex)}")
        assert False, "Failed to validate the content for Rule 11."

def test_rule_8_spelling_grammar_errors():
    # Initialize BlobServiceClient with real connection string
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # Define emails with grammatical and spelling errors
    email_data = """
    Email 1:
    From: sender1@lilly.com
    To: recipient1@thirdparty.com
    Subject: Email with Errors
    Body: Hello, I hope your doing well. Please check teh attached document.

    Email 2:
    From: sender2@lilly.com
    To: recipient2@thirdparty.com
    Subject: Correctly Written Email
    Body: Hello, I hope you're doing well. Please check the attached document.
    """

    # Load the rule for identifying spelling and grammatical errors
    rules = """
    Rule 8: Identify inconsistencies in spelling and grammatical errors.
    """

    # Mock metadata for emails
    metadata = "Some metadata"

    # Call the generate_report function to generate the report
    print("Calling generate_report with Rule 8...")
    generate_report(email_data, rules, metadata, blob_service_client, container_name)
    print("generate_report completed.")

    # Verify the report was uploaded to the blob storage
    report_blob_name = "generated_report.csv"
    report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)

    try:
        # Download the uploaded report to validate its content
        report_content = report_blob_client.download_blob().readall().decode('utf-8')

        # Print the report content for debugging
        print("Generated report content:")
        print(report_content)

        # Assert Rule 8 entry exists and detects errors in spelling and grammar
        assert "Rule8" in report_content
        assert "your doing well" in report_content  # Grammatical error
        assert "teh" in report_content  # Spelling error
        assert any(severity in report_content for severity in ["4", "5"]), "Expected severity to be 4 or 5"  # Flagged as risky due to errors

        print("Test passed for Rule 8.")

    except Exception as ex:
        print(f"Error downloading the blob or validating content: {str(ex)}")
        assert False, "Failed to validate the content for Rule 8."


# Define globally
blob_service_client = BlobServiceClient.from_connection_string(os.getenv("AZURE_BLOB_STORAGE_CONNECTION_STRING"))
container_name = "test"


def test_rule_urgency_signals():
    email_data = """
    From: sender@lilly.com
    To: recipient@thirdparty.com
    Subject: Urgent: Immediate Action Required
    Body: Please respond ASAP. This is urgent.
    """
    rules = """
    Rule 2: Assess urgency signals.
    """
    metadata = "Some metadata"

    generate_report(email_data, rules, metadata, blob_service_client, container_name)

    report_blob_name = "generated_report.csv"
    report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)

    report_content = report_blob_client.download_blob().readall().decode('utf-8')
    assert "Rule2" in report_content
    assert any(severity in report_content for severity in ["3", "4", "5"]), "Expected severity to be 3, 4, or 5"


def test_rule_formality_level():
    # Initialize BlobServiceClient with real connection string
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    # Define emails with different levels of formality
    email_data = """
    Email 1:
    From: sender1@lilly.com
    To: recipient1@thirdparty.com
    Subject: Casual Invitation
    Body: Hey John, we’d love for you to swing by the event if you're free. See you there!

    Email 2:
    From: sender2@lilly.com
    To: recipient2@thirdparty.com
    Subject: Formal Meeting Invitation
    Body: Dear Mr. Doe, we are honored to invite you to our formal event.
    """

    # Load the rule for evaluating formality level
    rules = """
    Rule 3: Evaluate the level of formality in language use.
    """

    # Mock metadata for emails
    metadata = "Some metadata"

    # Call the generate_report function to generate the report
    print("Calling generate_report with Rule 3...")
    generate_report(email_data, rules, metadata, blob_service_client, container_name)
    print("generate_report completed.")

    # Verify the report was uploaded to the blob storage
    report_blob_name = "generated_report.csv"
    report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)

    try:
        # Download the uploaded report to validate its content
        report_content = report_blob_client.download_blob().readall().decode('utf-8')

        # Print the report content for debugging
        print("Generated report content:")
        print(report_content)

        # Assert Rule 3 entry exists and detects differences in formality
        assert "Rule3" in report_content
        # Assert that severity is either 3, 4, or 5
        assert any(severity in report_content for severity in ["3", "4", "5"]), "Expected severity to be 3, 4, or 5"
  # Flagged as highly formal due to language level difference


        print("Test passed for Rule 3.")

    except Exception as ex:
        print(f"Error downloading the blob or validating content: {str(ex)}")
        assert False, "Failed to validate the content for Rule 3."


def test_rule_signature_consistency():
    email_data = """
    From: sender@lilly.com
    To: recipient@thirdparty.com
    Subject: Meeting Follow-Up
    Body: Regards, John Doe, Sales Manager, Lilly Inc.
    """
    rules = """
    Rule 14: Verify inconsistencies in signatures, including the format, contact information, and any legal disclaimers used.
    """
    metadata = "Some metadata"

    generate_report(email_data, rules, metadata, blob_service_client, container_name)

    report_blob_name = "generated_report.csv"
    report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)

    report_content = report_blob_client.download_blob().readall().decode('utf-8')
    assert "Rule14" in report_content
    assert any(severity in report_content for severity in ["3", "4", "5"]), "Expected severity to be 3, 4, or 5"  # High-risk flag due to inconsistent signature

def test_rule_dkim_dmarc_spf():
    email_data = """
    From: sender@lilly.com
    To: recipient@thirdparty.com
    Subject: Security Check
    Body: Please review the attached document.
    """
    rules = """
    Rule 21: Use EmailMetadata to assess DKIM, DMARC, and SPF results.
    """
    metadata = """
    SPF: Pass, DKIM: Fail, DMARC: Pass
    """

    generate_report(email_data, rules, metadata, blob_service_client, container_name)

    report_blob_name = "generated_report.csv"
    report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)

    report_content = report_blob_client.download_blob().readall().decode('utf-8')
    assert "Rule21" in report_content
    assert "4" in report_content  # Flagged due to DKIM failure


import csv
import pytest
from azure.storage.blob import BlobServiceClient

@pytest.fixture
def report_data():
    # Setup BlobServiceClient to access the generated report
    blob_service_client = BlobServiceClient.from_connection_string(os.getenv("AZURE_BLOB_STORAGE_CONNECTION_STRING"))
    container_name = "test"
    report_blob_name = "generated_report.csv"
    report_blob_client = blob_service_client.get_blob_client(container=container_name, blob=report_blob_name)

    # Download and read the report content
    report_content = report_blob_client.download_blob().readall().decode('utf-8')
    return list(csv.DictReader(report_content.splitlines()))



# Test Rule_name entries
def test_rule_names(report_data):
    expected_rule_names = [f"Rule{i+1}" for i in range(23)]
    for row in report_data:
        assert row["Rule_name"] in expected_rule_names, f"Unexpected rule name {row['Rule_name']} found."

# Test Rule ratio entries
def test_rule_ratio(report_data):
    for row in report_data:
        assert row["Rule ratio"], f"Rule ratio entry missing for {row['Rule_name']}"

# Test Severity entries
def test_severity_entries(report_data):
    for row in report_data:
        if row["Severity"] != "Not Available":  # Allow "Not Available" as valid
            try:
                severity = int(row["Severity"])
                assert 1 <= severity <= 5, f"Severity {severity} out of range for {row['Rule_name']}"
            except ValueError:
                assert False, f"Severity for {row['Rule_name']} is not a valid integer"

# Test Explanation entries
def test_explanation_entries(report_data):
    for row in report_data:
        assert row["Explanation"], f"Explanation missing for {row['Rule_name']}"

# Test Reference in the email entries
def test_reference_entries(report_data):
    for row in report_data:
        assert row["Reference in the email"], f"Reference missing for {row['Rule_name']}"

# Test Category entries
def test_category_entries(report_data):
    expected_categories = [
        "Tone Difference", "Urgency", "Formal Title", "Technicality", "Term Diversity",
        "Syntax Complexity", "VerbsDifference", "Mispelling", "Language Precision",
        "Personalization", "Word discrepancy", "Email Formatting", "Email structure",
        "Signature Inconsistencies", "Email variation", "Sentence Analysis",
        "Layout Analysis", "TimeStamp", "DayReceived", "Not Available"  # Include "Not Available"
    ]
    for row in report_data:
        assert row["Category"] in expected_categories, f"Unexpected category {row['Category']} for {row['Rule_name']}"

# Test Summary entries
def test_summary_entries(report_data):
    for row in report_data:
        assert row["Summary"], f"Summary missing for {row['Rule_name']}"

# Test EmailSummary entries
def test_email_summary_entries(report_data):
    for row in report_data:
        if row["Rule_name"] == "Rule19":
            assert row["EmailSummary"], f"EmailSummary missing for Rule19"
        else:
            assert row["EmailSummary"] == "Not Available", f"Unexpected EmailSummary value for {row['Rule_name']}"
