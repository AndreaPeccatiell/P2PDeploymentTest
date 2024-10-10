
import React, { useState, useRef, useEffect } from 'react';
import resets from '../_resets.module.css';
import classes from './LillyDetect.module.css';
import { Rectangle363Icon } from './Rectangle363Icon.tsx';
import { VectorIcon } from './VectorIcon.tsx';
import axios from 'axios';
import emailData from './selected_fields_domain.json';
import DOMPurify from 'dompurify';
import { InputLinearScale } from './InputLinearScale/InputLinearScale.tsx';
import { useNavigate } from 'react-router-dom';
import Header from './Header.js';

function LillyDetect({ props }) {
  const [fullLegalName, setFullLegalName] = useState('');
  const fileInputRef = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const [uploadedContent, setUploadedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailVerificationResults, setEmailVerificationResults] = useState(null);
  const [emailApiCalled, setemailApiCalled] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [triggerResult, setTriggerResult] = useState('');
  const [error, setError] = useState('');


  const navigate = useNavigate();

  const fetchTriggerData = async () => {
    setLoading(true);
    setTriggerResult(''); // Clear previous results
    setError(''); // Clear previous error
    try {
      const response = await axios.get('http://localhost:8000/api/analyze');
      setTriggerResult(response.data.results);
      const resultArray = triggerResult.split('\n');
    } catch (err) {
      setError('Failed to fetch data from API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = triggerResult.split('\n').map((line, index) => {
    const [label, value] = line.split(' = ');
    return (
      <p key={index}>
        <strong>{label} </strong> {value}
      </p>
    );
  });

 

  const fetchEmailVerification = async () => {
    // Simulate making the API call
    setLoading(true);
    try {
      // Simulated API call
      await axios.post('/api/verify_email', {
        email: 'example@example.com',
      });
      // Indicate that the API call has been made
      setemailApiCalled(true);
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setLoading(false);
    }
  };


  const summaryButtonClick = async () => {
    try {
      const response = await fetch('/api/text-content');
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json(); // Assuming the API returns JSON directly
      setShowContent(true);
    } catch (error) {
      console.error('Failed to fetch the text content:', error);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };
  

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
  
      // If you want to read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setUploadedContent(content); // Assuming setUploadedContent updates state with the file's content
        // Optionally, you could also store the file name or other properties
      };
      reader.readAsText(file);
  
      // If you just want to store the file for later upload
      // setUploadedFile(file); // Assuming setUploadedFile updates state with the File object
    } else {
      console.log("No file selected.");
    }
  };
  const fetchMailSummary = () => {
    // Endpoint URL of the Flask API
    const apiURL = 'http://localhost:8000/api/convert-and-download';

    // Fetch the response from the Flask API
    fetch(apiURL)
    .then((response) => response.blob()) // Convert the response to a blob
    .then((blob) => {
        // Create a URL for the blob object
        const url = window.URL.createObjectURL(new Blob([blob]));
        // Create an anchor (<a>) element to facilitate downloading
        const link = document.createElement('a');
        link.href = url;
        // Set the file name for the download
        link.setAttribute('download', 'MailSummary.xlsx');
        // Append the anchor to the body
        document.body.appendChild(link);
        // Simulate a click on the anchor to start the download
        link.click();
        // Clean up by removing the anchor from the body and revoking the blob URL
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error('Error fetching and downloading file:', error));
};

const handleAnalyzeDocument = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/mailReport', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json(); // Assuming the response is already JSON

    // Extract and format the rule name, its trigger, description, and example from the response
    const rulesComponents = Object.entries(data)
    .sort((a, b) => {
      // Extract the numerical part of the rule name
      const ruleNumberA = parseInt(a[0].match(/\d+/)[0], 10);
      const ruleNumberB = parseInt(b[0].match(/\d+/)[0], 10);
      return ruleNumberA - ruleNumberB;
    })
    .map(([ruleName, ruleDetails]) => {
      // Log the variables you're about to render to ensure they're what you expect
      console.log('Processing rule:', ruleName, ruleDetails);
      
      // Check if the current rule is Rule16 and modify its presentation accordingly
      if (ruleName === "rule16") {
        return (
          <div key={ruleName} className={classes.rule}>
            <p><strong>Special Attention - {ruleName}</strong>: <em>Font, padding, spacing analysis</em> - Grade: <strong>5</strong>, Special Description: Font, padding, spacing analysis.</p>
          </div>
        );
      } else {
        // For all other rules, use the original presentation
        const triggerValue = ruleDetails[1]; // Trigger value
        const exampleText = ruleDetails[4]; // Example text
        const description = ruleDetails[5]; // Description

        return (
          <div key={ruleName} className={classes.rule}>
            <p><strong>{ruleName}</strong>: {exampleText} - Grade: {triggerValue}, Description: {description}</p>
          </div>
        );
      }
    });
    console.log(rulesComponents); // Logging the JSX array
    setFullLegalName(rulesComponents); // Assuming this is where you want to store the components for rendering
  } catch (error) {
    console.error("Error during API call:", error);
  } finally {
    setLoading(false);
  }
};

  
  const handleCombinedButtonClick = async () => {
    setLoading(true);
  
    try {
      // Convert all API calls to return promises
      const emailVerificationPromise = axios.post('/api/verify_email', {
        email: 'example@example.com',
      });
  
      const analyzeDocumentPromise = fetch('/api/mailReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ /* your request body here */ })
      }).then(response => response.json());
  
      const fetchEmailHtmlContentPromise = axios.post('/api/email-content', { filePath: 'AI.msg' })
        .then(response => response.data.htmlContent);
  
      // Execute all promises in parallel and process their results
      const [verificationResponse, analyzeData, htmlContent] = await Promise.all([
        emailVerificationPromise,
        analyzeDocumentPromise,
        fetchEmailHtmlContentPromise
      ]);
  
      // Assuming the email verification response doesn't directly affect the UI
      setemailApiCalled(true); // or handle verificationResponse.data as needed
  
      // Process analyzeData (similar to handleAnalyzeDocument)
      const rulesComponents = Object.entries(analyzeData)
        .sort((a, b) => {
          const ruleNumberA = parseInt(a[0].match(/\d+/)[0], 10);
          const ruleNumberB = parseInt(b[0].match(/\d+/)[0], 10);
          return ruleNumberA - ruleNumberB;
        })
        .map(([ruleName, ruleDetails]) => {
          const triggerValue = ruleDetails[1]; // Assuming this is the trigger value
          const description = ruleDetails[2]; // The rule description
          const exampleText = ruleDetails[4]; // The example text, if available
  
          return (
            <div key={ruleName} className={classes.rule}>
              <p><strong>{ruleName} {exampleText}</strong>: Grade - {triggerValue}</p>
            </div>
          );
        });
  
      setFullLegalName(rulesComponents);
  
      // Set HTML content fetched from '/api/email-content'
      setHtmlContent(htmlContent);
  
    } catch (error) {
      console.error("Error during combined API calls:", error);
    } finally {
      setLoading(false);
    }
  };
  
  


  return (
    <div className={`${resets.clapyResets} ${classes.root} ${resets.verticalLayout}`}>
          <div className={classes.frame49} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />
      <input
        type="file"
        id="fileInput"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
  
        <div className={classes.domainSummary}>Domain tab </div>
       <div className={classes.rectangle365}>
  <div className={classes.heading}>
    <h2>Risk</h2>
    {emailApiCalled && (
      <>
        <p>Reputation: {emailData.reputation}</p>
        <p>Creation Date: {emailData.creation_date}</p>
        <p>Harmless: {emailData.harmless}</p>
      </>
    )}
  </div>
</div>
<div className={classes.rectangleLinguistic}>{fullLegalName}
<div className={classes.heading}>
<h2>Rules</h2>
</div>
</div>
       <div className={classes.rectangle371}>{renderContent}
    
      </div>
    
 

      <div className={classes.lILLYDETECT}>
      </div>



      {/* New button to generate mail summary */}

    
 
  
      <div className={classes.userDetails}></div>
      <div className={classes.toneTheToneOfTheUserIsSignific}>
        <p className={classes.labelWrapper4}>
          <span className={classes.label6}></span>
          <span className={classes.label7}> </span>
        </p>
      </div>

      <InputLinearScale
        className={classes.inputLinearScale}
        classes={{
          option: classes.option,
          option2: classes.option2,
          option3: classes.option3,
          option4: classes.option4,
          option5: classes.option5,
        }}
        text={{
          _1: <div className={classes._1}>Target Document</div>,
          _2: <div className={classes._2}>Analyze Document</div>,
          _3: <div className={classes._3}>Export Triggers</div>,
          _4: <div className={classes._4}>Assess Score</div>,
          _5: <div className={classes._5}>Rule Master</div>,
        }}
        onClick={{
          _5: () => navigate('/feedback-page'),
          _1: handleFileUpload,
          _2: handleCombinedButtonClick,
          _4: fetchTriggerData
        }}
      />
    </div>


  );
};

export default LillyDetect;