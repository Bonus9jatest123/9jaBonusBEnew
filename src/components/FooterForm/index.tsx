'use client';
import ToggleSwitch from '../ToggleSwitch';
import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '@/lib/constants';
import axios from 'axios';
import { getCookie } from '@/lib/cookies';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import { Offer } from '@/components/TabCards/index';
import ImageUploader from '@/components/ImageUploader';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});

const token = getCookie('token') && JSON.parse(getCookie('token') as any);

const FooterForm = (props: any) => {
  const headers = {
    'x-auth-token': token
  };
  const [loading, setLoading] = useState(false);
  const { filterOffer, formId, setShowFormId } = props;

  function ensureArrayLength(array: any, item: any, length: any) {
    while (array.length < length) {
      array.push(item);
    }

    return array;
  }

  const [initialValues, setInitialValues] = useState({
    links: [
      { name: '', icon: null, preview: null },
      { name: '', icon: null, preview: null },
      { name: '', icon: null, preview: null },
      { name: '', icon: null, preview: null },
      { name: '', icon: null, preview: null }
    ],

    pageLinks: [
      { name: '', link: '' },
      { name: '', link: '' },
      { name: '', link: '' },
      { name: '', link: '' },
      { name: '', link: '' },
      { name: '', link: '' }
    ],
    accordianSections: [{ title: '', expandedText: '' }],
    otherSections: [{ title: '', icon: null, expandedText: '', preview: null }],
    title: ''
  });

  useEffect(() => {
    if (formId) {
      axios
        .get(`${API_ENDPOINT}/footer/${formId}`, { headers })
        .then((response: { data: any }) => {
          setInitialValues((prev) => {
            return {
              ...prev,
              name: response.data.name,

              links: ensureArrayLength(
                response.data.followUs.map((item: any) => {
                  return { name: item?.link, icon: null, preview: item?.icon?.imageUrl || null };
                }),
                { name: '', icon: null, preview: null },
                5
              ),
              pageLinks: ensureArrayLength(
                response.data.pageLinks.map((item: any) => {
                  return { link: item?.link, name: item?.name };
                }),
                { name: '', link: '' },
                6
              ),
              accordianSections:
                response?.data?.accordians[0]?.items?.length != 0
                  ? response?.data?.accordians[0]?.items.map((item: any) => {
                      return { title: item?.title, expandedText: item?.text };
                    })
                  : [{ title: '', expandedText: '' }],
              title: response?.data?.accordians[0]?.mainTitle,
              otherSections:
                response?.data?.otherText?.length != 0
                  ? response?.data?.otherText.map((item: any) => {
                      return { title: item?.title, expandedText: item?.text, icon: null, preview: item?.icon?.imageUrl || null };
                    })
                  : [{ title: '', icon: null, expandedText: '' }]
            };
          });
        })
        .catch((error: any) => {
          console.error('Error fetching offers:', error);
        });
    }
  }, [formId]);

  const validationSchema = Yup.object().shape({
    links: Yup.array().of(
      Yup.object().shape({
        name: Yup.string()
        // icon: Yup.string().required('Required')
      })
    )
  });

  const { values, errors, handleChange, setFieldValue, resetForm, handleSubmit } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values: any) => {
       
      updateFooterDetail(values);
    }
  });

  const updateFooterDetail = (values: any) => {
   
    const formData = new FormData();
    const headers = {
      'x-auth-token': token,
    };

    formData.append('status', 'active');
    formData.append('name', values?.name);

    formData.append('accordians[mainTitle]', values?.title);
    (values.links || []).forEach((link: any, index: any) => {
      if (link.name) {
        formData.append(`followUs[${index}][link]`, link.name);
      }
      if (link.icon) {
        formData.append(`followUs[${index}][icon]`, link.icon);
      }
    });
    (values.pageLinks || []).forEach((link: any, index: any) => {
      if (link.link) {
        formData.append(`pageLinks[${index}][link]`, link.link);
      }
      if (link.name) {
        formData.append(`pageLinks[${index}][name]`, link.name);
      }
    });

    (values.accordianSections || []).forEach((link: any, index: any) => {
      if (link.title) {
        formData.append(`accordians[items][${index}][title]`, link.title);
      }
      if (link.expandedText) {
        formData.append(`accordians[items][${index}][text]`, link.expandedText);
      }
    });
    (values.otherSections || []).forEach((link: any, index: any) => {
      if (link.title) {
        formData.append(`otherText[${index}][title]`, link.title);
      }
      if (link.icon) {
        formData.append(`otherText[${index}][icon]`, link.icon);
      }
      if (link.expandedText) {
        formData.append(`otherText[${index}][text]`, link.expandedText);
      }
    });
    
    axios
      .put(`${API_ENDPOINT}/footer/${formId}`, formData, { headers })
      .then((response: { data: Offer }) => {
        toast.success('Update data successfully');
      })
      .catch((error: any) => {
        console.error('Error submitting form:', error);
        toast.error('Something went wrong');
        // resetStates();
      });
  };
console.log(values.accordianSections, "values.accordianSections")
  const handleAddAccordianSection = () => {
    setFieldValue('accordianSections', [...(values.accordianSections || []), { title: '', expandedText: '' }]);
  };

  const handleDeleteAccordianSection = (index: any) => {
    const copySection = [...values.accordianSections];
    copySection.splice(index, 1);
    setFieldValue('accordianSections', copySection);
  };

  const handleAddNewTextSection = () => {
    setFieldValue('otherSections', [...values.otherSections, { title: '', icon: null, expandedText: '' }]);
  };
  const handleDeleteNewTextSection = (index: any) => {
    const copySection = [...values.otherSections];
    copySection.splice(index, 1);
    setFieldValue('otherSections', copySection);
  };

  const handleIconChange = (event: any, index: any, type: any) => {
    const updatedLinks = [...values[type]];
    updatedLinks[index].icon = event.currentTarget.files[0];
    setFieldValue(type, updatedLinks);
  };

  return (
    <>
      <div className="wrapper">
        <div className="form-header">
          <h1 className="form-heading">{formId ? 'Update Footer Data' : 'All Footer'}</h1>
          <button className="back-btn" onClick={() => setShowFormId(null)}>
            Cancel
          </button>
        </div>
      </div>
      <div className="form-container">
        <>
          <div className="header-form">Follow us</div>
          {values.links.map(({ name, icon, preview }: { name: string; icon: any; preview: string }, index: any) => (
            <div className="first-row1" key={index}>
              <div className="form-group1">
                <label htmlFor="rating" className="rating">
                  Link {index}
                </label>
                <input type="text" onChange={handleChange} id={`links.${index}].name`} name={`links.${index}.name`} value={values.links[index].name} />
              </div>
              <div className="logo-icon">
                <label>Icon:</label>

                <ImageUploader
                  name="logo"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleIconChange(event, index, 'links');
                  }}
                  preview={icon ? URL.createObjectURL(icon) : preview ? preview : null}
                />
              </div>
            </div>
          ))}

          <div className="quill-input">
            <div className="key-info-inputs">
              <div className="header-form">Page Links</div>
              <div className="inputs__group1">
                {values.pageLinks.map(({ name }: { name: any }, index: any) => (
                  <>
                    <div className="group__input1" key={index + 1}>
                      <label>Name{index + 1}:</label>
                      <input type="text" onChange={handleChange} id={`pageLinks.${index}].name`} name={`pageLinks.${index}.name`} value={values.pageLinks[index].name} />
                    </div>
                    <div className="group__input1">
                      <label>Link{index + 1}:</label>
                      <input type="text" onChange={handleChange} id={`pageLinks.${index}].link`} name={`pageLinks.${index}.link`} value={values.pageLinks[index].link} />
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="header-form">Accordions</div>
            <div className="accordian-title">
              <div>Title</div>
              <input type="text" onChange={handleChange} id={`title`} name={`title`} value={values.title} className="title-input " />
            </div>
            {values?.accordianSections?.map(({}, index: any) => (
              <>
                <div className="accordian">
                  <div className="accordian-title">
                    <div>Accordion{index + 1}</div>
                    <div>Title</div>
                    <input
                      type="text"
                      onChange={handleChange}
                      id={`accordianSections.${index}].title`}
                      name={`accordianSections.${index}.title`}
                      value={values.accordianSections[index].title}
                      className="title-input "
                    />
                  </div>
                  {index != 0 && (
                    <div className="delete" onClick={() => handleDeleteAccordianSection(index)}>
                      <div className="delete-icon">
                        <svg viewBox="0 0 24 24">
                          <path d="M6,19C6,20.1 6.9,21 8,21H16C17.1,21 18,20.1 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"></path>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="accordian-expand">
                    <div>Accordion{index + 1}</div>
                    <div>Expanded Text</div>
                  </div>
                  <textarea
                    className="accordian-text-area"
                    onChange={handleChange}
                    id={`accordianSections.${index}.expandedText`}
                    name={`accordianSections.${index}.expandedText`}
                    value={values.accordianSections[index].expandedText}
                  ></textarea>
                </div>
              </>
            ))}

            <div className="add-new-section-label" onClick={handleAddAccordianSection}>
              <img src="/images/plus.png" alt="" />
              <div>Add Another Accordian</div>
            </div>
          </div>
          <div className="header-form">Other Text</div>
          {values.otherSections.map(({ icon, preview }: any, index: any) => (
            <>
              <div className="other-text" key={index}>
                <div>Other Text {index + 1} - Title</div>
                <input type="text" onChange={handleChange} id={`otherSections.${index}.title`} name={`otherSections.${index}.title`} value={values.otherSections[index].title} />
                <div className="logo-icon">
                  <label>Icon:</label>
                  <ImageUploader
                    name="logo"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleIconChange(event, index, 'otherSections');
                    }}
                    preview={icon ? URL.createObjectURL(icon) : preview ? preview : null}
                  />
                </div>
                <div className="delete" onClick={() => handleDeleteNewTextSection(index)}>
                  <div className="delete-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M6,19C6,20.1 6.9,21 8,21H16C17.1,21 18,20.1 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <textarea
                onChange={handleChange}
                className="accordian-text-area"
                id={`otherSections.${index}.expandedText`}
                name={`otherSections.${index}.expandedText`}
                value={values.otherSections[index].expandedText}
              ></textarea>
            </>
          ))}

          <div className="add-new-section-label" onClick={(e: any) => handleAddNewTextSection()}>
            <img src="/images/plus.png" alt="" />
            <div>Add Another Text Section</div>
          </div>
          <button type="submit" onClick={(e: any) => handleSubmit(e)} className="save-button" style={{ pointerEvents: loading ? 'none' : 'all' }}>
            {!loading ? 'Save' : <img className="save-loader" src="/images/loading.gif" alt="" />}
          </button>
        </>
      </div>
    </>
  );
};

export default FooterForm;
