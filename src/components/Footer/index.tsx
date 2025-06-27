import React, { useEffect, useState } from 'react';
import Accordians from './Accordians';

function Footer({ data }: { data: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <>
      <div className="footer-header">
        <img src="/images/svg/footer-logo.svg" alt="Footer Logo" />
      </div>

      <div className="footer">
        {/* Follow Us Section */}
        <div className="followus">
          <div className="follow-detail">
            <div>Follow us</div>
            <img src="/images/svg/flag.svg" alt="Flag" />
          </div>

          <div className="follow-icons">
            {data?.followUs?.map((item: any, index: number) => (
              <a
                key={index}
                target="_blank"
                href={item?.link}
                rel="noopener noreferrer"
              >
                <img
                  className="follow-icon"
                  src={item?.icon?.imageUrl}
                  alt={`Social Icon ${index + 1}`}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Page Links Section */}
        <div className="page-links">
          {data?.pageLinks?.map((item: any, index: number) => (
            <a
              key={index}
              target="_blank"
              className="fifty-per"
              href={item?.link}
              rel="noopener noreferrer"
            >
              {item?.name}
            </a>
          ))}
        </div>

        {/* Accordions Section */}
        <div>{data?.accordians?.[0]?.mainTitle}</div>
        {data?.accordians?.[0]?.items?.map(
          ({ title, text }: { title: string; text: string }, index: number) => (
            <Accordians key={index} title={title} text={text} />
          )
        )}

        {/* Other Text Section */}
        {data?.otherText?.map((item: any, index: number) => (
          <div key={index} className="other-products">
            <div className="other-product">
              <img
                className="other-text-icon"
                src={item?.icon?.imageUrl}
                alt={`Other Icon ${index + 1}`}
              />
              <div>{item?.title}</div>
            </div>
            <div className="detail">{item?.text}</div>
          </div>
        ))}

        {/* Footer Note */}
        <div className="powered">POWERED BY BONUS9JA</div>
      </div>
    </>
  );
}

export default Footer;
