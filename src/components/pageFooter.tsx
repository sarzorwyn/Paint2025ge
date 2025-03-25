const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm py-4 px-6 text-center border-t">
      <div>
        <p>
          Contains information from Electoral Boundary 2025 (GEOJSON) accessed
          on 15 March 2025 from{" "}
          <a
            href="https://data.gov.sg/datasets/d_7ddf956dfc1c59080bf95bba1c58a5d2/view"
            className="text-gray-800 font-bold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            data.gov.sg
          </a>{" "}
          which is made available under the terms of the{" "}
          <a
            href="https://data.gov.sg/open-data-licence"
            className="text-gray-800 font-bold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Singapore Open Data Licence version 1.0
          </a>
          .
        </p>
      </div>
      <div className="mt-10">
        <a
          href="https://ivant-page.vercel.app/"
          className="text-gray-800 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          About the Author
        </a>
        <br/>
        
        Special thanks to {" "}
        <a
          href="https://github.com/SmoothPelican"
          className="text-gray-800 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          @SmoothPelican
        </a>
        {" "}for data on new parties
      </div>
    </footer>
  );
};

export default Footer;
