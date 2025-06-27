'use client';
import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { getCookie } from '@/lib/cookies';
import { Offer } from '@/components/TabCards/index';
import ImageUploader from '@/components/ImageUploader';
import { API_ENDPOINT } from '@/lib/constants';
import SelectionsTable from '../SelectionsTable';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});

export interface FormData {
  rating: number | null;
  name: string;
  promoInfo: string;
  logo: File | { type?: string };
  playLink: string;
  review: string;
  pros: string;
  cons: string;
  upTo: string;
  wageringRollover: string;
  minOdds: string;
  terms: string;
  enabled: boolean;
  infoImage: File | { type?: string };
  minOddsForBonus: number | null;
  selections: {
    [key: number]: number | null;
  };
}
interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filterOffer: Offer;
  selectedId: string;
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
  setFilterOffer: React.Dispatch<React.SetStateAction<any>>;
  offers: Offer[];
}
const FormContainer = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [infoImagePreview, setInfoImagePreview] = useState<string>('');
  const { setIsOpen, filterOffer, selectedId, setFilterOffer, offers, setSelectedId, setOffers } = props;
  const initialValues: FormData = {
    rating: filterOffer?.rating || null,
    name: filterOffer?.name || '',
    promoInfo: filterOffer?.promoInfo || '',
    logo: {},
    playLink: filterOffer?.playLink || '',
    review: filterOffer?.review || '',
    pros: filterOffer?.pros || '',
    cons: filterOffer?.cons || '',
    upTo: filterOffer?.upTo || '',
    wageringRollover: filterOffer?.wageringRollover || '',
    minOdds: filterOffer?.minOdds || '',
    terms: filterOffer?.terms || '',
    enabled: typeof filterOffer?.enabled === 'boolean' ? filterOffer?.enabled : true,
    infoImage: {},
    minOddsForBonus: filterOffer?.minOddsForBonus || null,
    selections: filterOffer?.selections || {}
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Bookie is required'),
    playLink: Yup.string().required('Play now link is required'),
    promoInfo: Yup.string().max(20).required('Promo info is required'),
    rating: Yup.number().min(0).max(5).required('Rating is required')
  });

  const [active, setActive] = useState('key');
  const token = getCookie('token') && JSON.parse(getCookie('token') as any);

  const resetStates = () => {
    setIsOpen(false);
    setSelectedId('');
    setFilterOffer({});
    setLoading(false);
  };
  const { values, errors, handleChange, setFieldValue, resetForm, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      updateOffer(values);
    }
  });

  const updateOffer = (values: FormData) => {
    const formData = new FormData();
    const headers = {
      'x-auth-token': token,
      'Content-Type': 'multipart/form-data'
    };

    if (values.logo && values?.logo?.type) {
      formData.append('logo', values.logo as Blob);
    }

    if (values.infoImage && values?.infoImage?.type) {
      formData.append('infoImage', values.infoImage as Blob);
    }

    const editId = selectedId || '';
    const changedValues = {};
    if (editId) {
      if (initialValues.enabled !== values.enabled) formData.append('enabled', `${values.enabled}`);
      if (JSON.stringify(initialValues.selections) !== JSON.stringify(values.selections)) formData.append('selections', JSON.stringify(values.selections));
      Object.keys(values).forEach((key) => {
        if ((values as any)[key] !== (initialValues as any)[key]) {
          (changedValues as any)[key] = (values as any)[key];
        }
      });

      const appendedFieldNames = ['enabled', 'logo', 'infoImage', 'selections'];

      Object.keys(changedValues).forEach((fieldName) => {
        (changedValues as any)[fieldName] && !appendedFieldNames.includes(fieldName) && formData.append(fieldName, (changedValues as any)[fieldName]);
      });

      if ([...(formData as any).entries()].length > 0) {
        setLoading(true);
        axios
          .put(`${API_ENDPOINT}/offers/${editId}`, formData, { headers })
          .then((response: { data: Offer }) => {
            const { data } = response;
            resetForm();
            const offersCopy = [...offers];
            const index = offersCopy?.findIndex((item) => item?._id === editId);

            if (index !== -1) {
              offersCopy[index] = { ...offersCopy[index], ...data };
              setOffers(offersCopy);
              toast.success('Updated');
            }
            resetStates();
          })
          .catch((error: any) => {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong');
            resetStates();
          });
      } else resetStates();
    } else {
      const appendedFieldNames = ['enabled', 'logo', 'infoImage', 'selections'];
      formData.append('enabled', `${values.enabled}`);
      formData.append('selections', JSON.stringify(values.selections));
      Object.keys(values).forEach((fieldName) => {
        (values as any)[fieldName] && !appendedFieldNames.includes(fieldName) && formData.append(fieldName, (values as any)[fieldName]);
      });
      setLoading(true);
      axios
        .post(`${API_ENDPOINT}/offers/`, formData, { headers })
        .then((response: { data: Offer }) => {
          resetForm();
          toast.success('Added');
          const offersCopy = [...offers];
          offersCopy.push(response.data);
          setOffers(offersCopy);
          resetStates();
        })
        .catch((error: any) => {
          console.error('Error submitting form:', error);
          toast.error('Something went wrong');
          resetStates();
        });
    }
  };

  const modules = {
    toolbar: [{ list: 'bullet' }, { list: 'unordered' }]
  };

  const formats = ['list', 'bullet'];

  return (
    <>
      <div className="wrapper">
        <div className="form-header">
          <h1 className="form-heading">{selectedId ? 'Edit Offer' : 'Add New Offer'}</h1>
          <button className="back-btn" onClick={resetStates}>
            Cancel
          </button>
        </div>
      </div>
      <div className="form-container">
        <>
          <div className="first-row">
            <div className="form-group">
              <label htmlFor="rating">Rating:*</label>
              <input type="number" onChange={handleChange} id="rating" name="rating" value={values.rating || ''} min={0} max={5} step={0.1} />
              {errors?.rating && <div className="error-message">{errors?.rating}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="bookie">Bookie:*</label>
              <input type="text" onChange={handleChange} id="bookie" name="name" value={values.name} />
              {errors?.name && <div className="error-message">{errors?.name}</div>}
            </div>
          </div>
          <div className="form-group-promo">
            <label htmlFor="bonus">Promo info:*</label>
            <input maxLength={20} type="text" onChange={handleChange} id="bonus" name="promoInfo" value={values.promoInfo || ''} />
            <div className="input-length">{values.promoInfo.length}/20</div>
            {errors?.promoInfo && <div className="error-message">{errors?.promoInfo}</div>}
          </div>
          <div className="first-row">
            <div className="form-group-promo">
              <label htmlFor="playNowLink">Play now link:*</label>
              <input type="text" onChange={handleChange} id="playNowLink" name="playLink" value={values.playLink} />
              {errors?.playLink && <div className="error-message">{errors?.playLink}</div>}
            </div>

            <div>
              <label>Logo:</label>
              <ImageUploader
                name="logo"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue('logo', event.currentTarget.files![0]);
                }}
                preview={filterOffer?.logo?.imageUrl}
              />
            </div>
          </div>

          <div className="buttons">
            <div className="review-button" onClick={() => setActive('key')} style={{ border: `${active === 'key' ? '3px solid green' : '2px solid black'}` }}>
              Add Key Info
            </div>
            <div className="review-button" onClick={() => setActive('review')} style={{ border: `${active === 'review' ? '3px solid green' : '2px solid black'}` }}>
              Add Review
            </div>
            <div className="review-button" onClick={() => setActive('tcs')} style={{ border: `${active === 'tcs' ? '3px solid green' : '2px solid black'}` }}>
              Add T&Cs
            </div>
            <div className="review-button" onClick={() => setActive('bonus')} style={{ border: `${active === 'bonus' ? '3px solid green' : '2px solid black'}` }}>
              Add Multiple Bonus
            </div>
          </div>
          {active === 'review' && (
            <>
              <div className="review-block">
                <div className="quill-input-1">
                  <label>Pros:</label>
                  <ReactQuill
                    placeholder="Enter the content of the Pros*"
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    onChange={(content: string) => setFieldValue('pros', content)}
                    value={values.pros}
                  />
                </div>

                <div className="quill-input-1">
                  <label>Cons:</label>
                  <ReactQuill
                    placeholder="Enter the content of the cons*"
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    onChange={(content: string) => setFieldValue('cons', content)}
                    value={values.cons}
                  />
                </div>
              </div>
              <div className="quill-input">
                <label>Review:</label>
                <ReactQuill placeholder="Enter the content of the review*" theme="snow" onChange={(content: string) => setFieldValue('review', content)} value={values.review} />
              </div>
            </>
          )}
          {active === 'key' && (
            <div className="quill-input">
              <div className="key-info-inputs">
                <div className="info-image">
                  <label>Info image:</label>
                  <ImageUploader
                    name="infoImage"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('infoImage', event.currentTarget.files![0]);
                      setInfoImagePreview(URL.createObjectURL(event.currentTarget.files![0]));
                    }}
                    preview={infoImagePreview || filterOffer?.infoImage?.imageUrl}
                  />
                </div>
                <div className="inputs__group">
                  <div className="group__input">
                    <label>Bonus:</label>
                    <input type="text" onChange={handleChange} id="upTo" name="upTo" value={values.upTo} />
                  </div>
                  <div className="group__input">
                    <label>Turnover:</label>
                    <input type="text" onChange={handleChange} id="wageringRollover" name="wageringRollover" value={values.wageringRollover} />
                  </div>
                  <div className="group__input">
                    <label>Min odds:</label>
                    <input type="text" onChange={handleChange} id="minOdds" name="minOdds" value={values.minOdds} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {active === 'tcs' && (
            <div className="quill-input">
              <ReactQuill placeholder="Enter the content of the T&Cs*" theme="snow" onChange={(content: string) => setFieldValue('terms', content)} value={values.terms} />
            </div>
          )}
          {active === 'bonus' && (
            <>
              <div className="form-group-promo bonus-input">
                <label htmlFor="minOddsForBonus">Minimum selection odds to qualify for multiple bonus: </label>
                <input maxLength={20} type="number" step={0.01} onChange={handleChange} id="minOddsForBonus" name="minOddsForBonus" value={values.minOddsForBonus || ''} />
              </div>
              <SelectionsTable values={values} handleChange={handleChange} />
            </>
          )}
          <div className="enable-check">
            <input type="checkbox" name="enabled" id="enabled" checked={values.enabled} onChange={handleChange} />
            <label htmlFor="enabled">Enabled</label>
          </div>
          <button type="submit" onClick={(e: any) => handleSubmit(e)} className="save-button" style={{ pointerEvents: loading ? 'none' : 'all' }}>
            {!loading ? 'Save' : <img className="save-loader" src="/images/loading.gif" alt="" />}
          </button>
        </>
      </div>
    </>
  );
};

export default FormContainer;
