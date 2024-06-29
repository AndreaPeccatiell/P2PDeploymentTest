
import { memo, useState, useEffect } from 'react';
import type { FC } from 'react';
import classes from './LillyDocumentDetect.module.css';
import { BigFrame } from './BigFrame/BigFrame.tsx';
import LoadingBar from './LoadingBar.tsx';
import Arrow from './Arrow.tsx';

interface Props {
  className?: string;
}

export const LillyDocumentDetect: FC<Props> = memo(function LillyDocumentDetect() {
  const [fileName, setFileName] = useState('');
  const [articles, setArticles] = useState<string[]>([]);
  const [currentFolderIndex] = useState(0);
  const [folders, setFolders] = useState<string[]>([]);
 
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfMetadata, setPdfMetadata] = useState<Record<string, string | null>>({});
  const [pdfSignatures, setPdfSignatures] = useState<any[]>([]);
  const [imageCount, setImageCount] = useState(0);
  const [showLoadingBar, setShowLoadingBar] = useState(false);

  const [firstImageUrls, setFirstImageUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFolderContents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/folder-contents');
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
          const folderNames = Object.keys(data);
          setFolders(folderNames);
          setArticles(data[folderNames[0]]);
        } else {
          const errorData = await response.json();
          console.error('Error fetching folder contents:', errorData);
        }
      } catch (error) {
        console.error('Error fetching folder contents:', error);
      }
    };

    fetchFolderContents();
  }, []);

  const handleArticleClick = async (folder: string, file: string) => {
    setFileName(file);
    const filePath = `${folder}/${file}`;
    console.log('Selected File Path:', filePath);

    // Fetch metadata and signatures
    const response = await fetch('http://localhost:8000/api/pdf-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_path: filePath }),
    });

    if (response.ok) {
      const data = await response.json();
      setPdfMetadata(data.metadata);
      setPdfSignatures(data.signatures);
    } else {
      console.error('Error fetching PDF info');
    }

    // Fetch image count
    const imageCountResponse = await fetch('http://localhost:8000/api/pdf-image-count', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_path: filePath }),
    });

    if (imageCountResponse.ok) {
      const imageCountData = await imageCountResponse.json();
      setImageCount(imageCountData.image_count);
    } else {
      console.error('Error fetching image count');
    }

    // Display PDF
    const pdfUrl = `http://localhost:8000/uploads/${filePath}`;
    setPdfUrl(pdfUrl);

    // Set first image for right BigFrame
    if (firstImageUrls[file]) {
      const firstImageUrl = `http://localhost:8000/${firstImageUrls[file]}`;
      console.log('First Image URL:', firstImageUrl);
      setFirstImageUrls((prev) => ({ ...prev, [file]: firstImageUrl }));
    }
  };



  const handleAnalyzeClick = async () => {
    setShowLoadingBar(true);
    try {
      const response = await fetch('http://localhost:8000/api/analyze-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
  
        console.log('Image Data:', data);
        // Store the first image URL for each PDF
        const newFirstImageUrls = Object.keys(data).reduce((acc, key) => {
          if (data[key].length > 0) {
            acc[key] = data[key][0];
          }
          return acc;
        }, {} as Record<string, string>);
        setFirstImageUrls(newFirstImageUrls);
      } else {
        const errorData = await response.json();
        console.error('Error processing PDFs:', errorData);
      }
    } catch (error) {
      console.error('Error processing PDFs:', error);
    } finally {
      setShowLoadingBar(false);
    }
  };

  return (
    <div className={`${classes.root}`}>
      <LoadingBar show={showLoadingBar} />
      <div className={classes.rectangle359}>
        <div className={`${classes.rectangle370}`}></div>
        <h2 style={{ paddingTop: '30px', color: 'white', paddingLeft: '50px' }}>Files List</h2>
        <div style={{ paddingTop: '50px', paddingLeft: '50px' }}>
          {articles.map((article, index) => (
            <div
              key={index}
              className={`${classes.article}`}
              onClick={() => handleArticleClick(folders[currentFolderIndex], article)}
              style={{
                paddingTop: '10px',
                color: 'white',
                fontSize: '20px',
                fontFamily: 'Poppins, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
                textDecoration: 'underline',
                position: 'relative',
                margin: '10px 0',
              }}
            >
              {article}
            </div>
          ))}
        </div>
        <div className={classes.lILLYDETECT}>
          <p className={classes.labelWrapper5}>
            <span className={classes.label3}>LILLY </span>
            <span className={classes.label4}>DETECT</span>
          </p>
        </div>
      </div>

      <div className={classes.middleSection}>
       
        <BigFrame
          className={classes.bigFrame}
          pdfUrl={pdfUrl}
          pdfMetadata={pdfMetadata}
          pdfSignatures={pdfSignatures}
          imageCount={imageCount}
        />

        {showLoadingBar && <Arrow />}

        <BigFrame
          className={classes.bigFrame}
          pdfUrl={firstImageUrls[fileName] ? `http://localhost:8000/${firstImageUrls[fileName]}` : null}
          pdfMetadata={{}} // Provide empty object for optional props
          pdfSignatures={[]} // Provide empty array for optional props
          imageCount={0} // Provide default value for optional props
          showInfoFrame={false}
        />

    
      </div>

      <div className={classes.bottomSection}>
        <div className={classes.newFrames}>
          <div className={classes.uploadFrame}>
            <p>Upload your documents</p>
          </div>
          <div className={classes.generalInfoFrame} onClick={handleAnalyzeClick}>
            <p>Analyze Image</p>
          </div>
        </div>
        <div className={classes.rectangle363}></div>
      </div>
    </div>
  );
});
