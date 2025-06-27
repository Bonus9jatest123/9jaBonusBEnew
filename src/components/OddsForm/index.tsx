'use client';
import React, { useEffect, useState } from 'react';
import ToggleSwitch from '../ToggleSwitch';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { getLocalDate, getOddsInitialValues } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Fixture, FixtureForForm } from '@/types/commonTypes';
import { useDispatch } from 'react-redux';
import { setEditId, setOdds } from '@/redux/features/fixturesFormSlice';
import ConfirmationPopup from '../ConfirmationPopup';
import { getCookie } from '@/lib/cookies';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
interface OddsFormProps {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const validationSchema = yup.object().shape({
  eventDateTime: yup.string().required('This field is required'),
  league: yup.string().required('This field is required'),
  homeTeam: yup.string().required('This field is required'),
  awayTeam: yup.string().required('This field is required')
});

function getDataForForm(oddData: any, bookies: string[]) {
  const oddsWithoutId: any = Object.fromEntries(
    Object.entries(oddData?.odds as any).map(([key, value]: [any, any]) => {
      const { _id, bestCalculatedOdds, ...rest } = value;
      return [key, rest];
    })
  );

  bookies.forEach((bookieName) => {
    if (!oddsWithoutId.hasOwnProperty(bookieName)) {
      oddsWithoutId[bookieName] = { oneX: { homeWin: 0, draw: 0, awayWin: 0 }, suspended: false };
    }
  });

  const { bestCalculatedOdds, order, __v, ...oddDataForForm } = oddData;
  const formData = { ...oddDataForForm, odds: oddsWithoutId };
  return formData;
}

const OddsForm = ({ setShowForm }: OddsFormProps) => {
  const dispatch = useDispatch();
  const odds = useSelector((state: RootState) => state.fixturesFormState.odds);
  const editId = useSelector((state: RootState) => state.fixturesFormState.editId);
  const bookies = useSelector((state: RootState) => state.bookiesState.bookies);
  const bookieNames = Object.keys(bookies);
  const token = getCookie('token') && JSON.parse(getCookie('token') as any);
  const headers = {
    'x-auth-token': token
  };

  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const initialValues: FixtureForForm = {
    _id: '',
    eventDateTime: '',
    league: '',
    homeTeam: '',
    awayTeam: '',
    suspendAll: false,
    odds: getOddsInitialValues(bookieNames)
  };

  const { setFieldValue, handleChange, handleSubmit, values, errors, setValues }: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values: any) => {
      updateFixture(values);
    }
  });

  const updateFixture = async (values: FixtureForForm) => {
    const oddsCopy = [...odds];
    const { _id, ...odd } = values;

    setSaving(true);
    if (editId) {
      try {
        const { data: updatedOdd } = await axios.put(`${API_ENDPOINT}/odds/${editId}`, { ...odd }, { headers });
        const index = oddsCopy.findIndex((item) => item._id === editId);
        oddsCopy.splice(index, 1, updatedOdd);
        dispatch(setOdds(oddsCopy));
        toast.success('Updated');
        resetState();
      } catch (error) {
        toast.error('Something went wrong');
        console.log('Odds error: ', error);
        setSaving(false);
      }
    } else {
      try {
        const { data: newOdd } = await axios.post(`${API_ENDPOINT}/odds`, { ...odd }, { headers });
        oddsCopy.push(newOdd);
        dispatch(setOdds(oddsCopy));
        toast.success('Added');
        resetState();
      } catch (error: any) {
        toast.error('Something went wrong');
        console.log('Odds error: ', error);
        setSaving(false);
      }
    }
  };

  useEffect(() => {
    if (editId) {
      const oddData = odds.find((item: any) => item._id === editId);
      const formData = getDataForForm(oddData, bookieNames);
      setValues(formData as Fixture);
    }
  }, [editId]);

  useEffect(() => {
    for (const bookie in values.odds) {
      if (!values.odds[bookie].suspended) setFieldValue('suspendAll', false);
    }
  }, [values.odds]);

  const handleDateTimeChange = (event: React.ChangeEvent<any>) => {
    const localDate = new Date(event.target.value);
    if (isNaN(localDate.getTime())) {
      console.log('invalid date!');
      return;
    }

    setFieldValue('eventDateTime', localDate.toISOString());
  };

  const resetState = () => {
    dispatch(setEditId(''));
    setSaving(false);
    setShowPopup(false);
    setShowForm(false);
    localStorage.clear();
  };

  const handleDelete = async () => {
    if (editId) {
      setSaving(true);
      try {
        await axios.delete(`${API_ENDPOINT}/odds/${editId}`, { headers });
        const filteredOdds = odds.filter((item: any) => item._id !== editId);
        dispatch(setOdds(filteredOdds));
        toast.success('Odd deleted');
        resetState();
      } catch (error) {
        toast.error('Something went wrong');
        console.log('Odds error: ', error);
        setSaving(false);
      }
    } else resetState();
  };

  const handleSuspendAllChange = (e: React.ChangeEvent<any>) => {
    setFieldValue(`suspendAll`, e.target.checked);

    bookieNames.forEach((bookieName) => {
      setFieldValue(`odds.${bookieName}.suspended`, e.target.checked);
    });
  };

  return (
    <div className="form-container">
      <div className="first-row">
        <div className="form-group">
          <label htmlFor="eventDateTime">Event Date/Time*</label>
          <input type="datetime-local" id="eventDateTime" name="eventDateTime" value={getLocalDate(values.eventDateTime!)} onChange={handleDateTimeChange} />
          {errors?.eventDateTime && <div className="error-message">{errors?.eventDateTime}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="league">League*</label>
          <input type="text" id="league" name="league" value={values.league} onChange={handleChange} />
          {errors?.league && <div className="error-message">{errors?.league}</div>}
        </div>
      </div>
      <div className="first-row">
        <div className="form-group">
          <label htmlFor="homeTeam">Home Team*</label>
          <input type="text" id="homeTeam" name="homeTeam" value={values.homeTeam} onChange={handleChange} />
          {errors?.homeTeam && <div className="error-message">{errors?.homeTeam}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="awayTeam">Away Team*</label>
          <input type="text" id="awayTeam" name="awayTeam" value={values.awayTeam} onChange={handleChange} />
          {errors?.awayTeam && <div className="error-message">{errors?.awayTeam}</div>}
        </div>
      </div>

      <div className="bookie-info">
        <div className="bookie-label">
          <div className="bookie">Bookie</div> <div className="odds">Odds(1X2)</div>
        </div>
        {bookieNames.map((bookieName) => (
          <div className="bookie-row" key={bookieName}>
            <div className="bookie-name">{bookieName}</div>
            <div className="odds">
              <input
                className="odds-input"
                type="number"
                step={0.01}
                id={`odds.${bookieName}.oneX.homeWin`}
                name={`odds.${bookieName}.oneX.homeWin`}
                value={values.odds[bookieName]?.oneX?.homeWin}
                onChange={handleChange}
              />
              <input
                className="odds-input"
                type="number"
                step={0.01}
                id={`odds.${bookieName}.oneX.draw`}
                name={`odds.${bookieName}.oneX.draw`}
                value={values.odds[bookieName]?.oneX?.draw}
                onChange={handleChange}
              />
              <input
                className="odds-input"
                type="number"
                step={0.01}
                id={`odds.${bookieName}.oneX.awayWin`}
                name={`odds.${bookieName}.oneX.awayWin`}
                value={values.odds[bookieName]?.oneX?.awayWin}
                onChange={handleChange}
              />
              <ToggleSwitch id={`odds.${bookieName}.suspended`} name={`odds.${bookieName}.suspended`} checked={values.odds[bookieName].suspended} onChange={(e: any) => handleChange(e)} />
            </div>
          </div>
        ))}
      </div>

      <div className="delete-section">
        <div className="suspend-toggle">
          <div className="label">All Live/Suspend</div>
          <ToggleSwitch id="suspendAll" name="suspendAll" checked={values.suspendAll} onChange={handleSuspendAllChange} />
        </div>
        <div className="delete-event" onClick={() => setShowPopup(true)}>
          <span className="label">Delete Event</span>
          <svg className="delete-icon" viewBox="0 0 24 24">
            <path d="M6,19C6,20.1 6.9,21 8,21H16C17.1,21 18,20.1 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" />
          </svg>
        </div>
      </div>

      <button type="submit" className="save-button" style={{ pointerEvents: saving ? 'none' : 'all' }} onClick={handleSubmit as any}>
        {!saving ? 'Save' : <img className="save-loader" src="/images/loading.gif" alt="" />}
      </button>

      {showPopup && <ConfirmationPopup message="Do you want to permanently Delete this event?" onYes={handleDelete} onNo={() => setShowPopup(false)} saving={saving} />}
    </div>
  );
};

export default OddsForm;
