import { useState } from 'react';
import './ReportFoundItem.css';

const CATEGORY_OPTIONS = [
  'NIC',
  'Student / Staff ID',
  'Bank Card',
  'Purse',
  'Others'
];

const ReportFoundItem = () => {
  const [category, setCategory] = useState('');
  const [purseOption, setPurseOption] = useState('with-id');
  const [submitted, setSubmitted] = useState(false);
  const [handedOver, setHandedOver] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nicName: '',
    nicNumber: '',
    idName: '',
    studentOrStaffId: '',
    cardType: '',
    bankName: '',
    cardLast4: '',
    bankPrivateLocation: '',
    bankPrivateDate: '',
    bankPrivateTime: '',
    cardCvv: '',
    purseName: '',
    purseIdNumber: '',
    purseMoney: '',
    purseOtherItems: '',
    pursePrivateLocation: '',
    pursePrivateDate: '',
    pursePrivateTime: '',
    otherPhoto: null,
    otherPrivateLocation: '',
    otherPrivateDate: '',
    otherPrivateTime: ''
  });

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubmitted(false);
    setHandedOver(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, otherPhoto: e.target.files?.[0] || null }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!category) nextErrors.category = 'Please select a category.';

    if (category === 'NIC') {
      if (!formData.nicName.trim()) nextErrors.nicName = 'Name is required.';
      if (!formData.nicNumber.trim()) nextErrors.nicNumber = 'NIC Number is required.';
    }

    if (category === 'Student / Staff ID') {
      if (!formData.idName.trim()) nextErrors.idName = 'Name is required.';
      if (!formData.studentOrStaffId.trim()) nextErrors.studentOrStaffId = 'Student ID or Staff ID is required.';
    }

    if (category === 'Bank Card') {
      if (!formData.cardType) nextErrors.cardType = 'Card Type is required.';
      if (!formData.bankName.trim()) nextErrors.bankName = 'Name of the Bank is required.';
      if (!/^\d{4}$/.test(formData.cardLast4.trim())) nextErrors.cardLast4 = 'Last 4 digits must be exactly 4 numbers.';
      if (!formData.bankPrivateLocation.trim()) nextErrors.bankPrivateLocation = 'Location is required.';
      if (!formData.bankPrivateDate) nextErrors.bankPrivateDate = 'Date is required.';
      if (!formData.bankPrivateTime) nextErrors.bankPrivateTime = 'Time is required.';
    }

    if (category === 'Purse') {
      if (purseOption === 'with-id') {
        if (!formData.purseName.trim()) nextErrors.purseName = 'Name is required.';
        if (!formData.purseIdNumber.trim()) nextErrors.purseIdNumber = 'Student ID or NIC number is required.';
      }

      if (purseOption === 'without-id') {
        if (!formData.purseMoney.trim()) nextErrors.purseMoney = 'Amount of money is required.';
        if (!formData.purseOtherItems.trim()) nextErrors.purseOtherItems = 'Other items inside purse are required.';
        if (!formData.pursePrivateLocation.trim()) nextErrors.pursePrivateLocation = 'Location is required.';
        if (!formData.pursePrivateDate) nextErrors.pursePrivateDate = 'Date is required.';
        if (!formData.pursePrivateTime) nextErrors.pursePrivateTime = 'Time is required.';
      }
    }

    if (category === 'Others') {
      if (!formData.otherPhoto) nextErrors.otherPhoto = 'Photo upload is required.';
      if (!formData.otherPrivateLocation.trim()) nextErrors.otherPrivateLocation = 'Location is required.';
      if (!formData.otherPrivateDate) nextErrors.otherPrivateDate = 'Date is required.';
      if (!formData.otherPrivateTime) nextErrors.otherPrivateTime = 'Time is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const handleHandedOver = () => {
    setHandedOver(true);
  };

  return (
    <div className="report-found-page">
      <div className="report-card">
        <h1>Report Found Item</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="required">Category</label>
            <select value={category} onChange={handleCategoryChange}>
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>

          {category === 'NIC' && (
            <div className="category-section">
              <h3>NIC Details</h3>
              <div className="form-group">
                <label className="required">Name</label>
                <input name="nicName" value={formData.nicName} onChange={handleInputChange} />
                {errors.nicName && <p className="error-text">{errors.nicName}</p>}
              </div>
              <div className="form-group">
                <label className="required">NIC Number</label>
                <input name="nicNumber" value={formData.nicNumber} onChange={handleInputChange} />
                {errors.nicNumber && <p className="error-text">{errors.nicNumber}</p>}
              </div>
            </div>
          )}

          {category === 'Student / Staff ID' && (
            <div className="category-section">
              <h3>Student / Staff ID Details</h3>
              <div className="form-group">
                <label className="required">Name</label>
                <input name="idName" value={formData.idName} onChange={handleInputChange} />
                {errors.idName && <p className="error-text">{errors.idName}</p>}
              </div>
              <div className="form-group">
                <label className="required">Student ID or Staff ID</label>
                <input name="studentOrStaffId" value={formData.studentOrStaffId} onChange={handleInputChange} />
                {errors.studentOrStaffId && <p className="error-text">{errors.studentOrStaffId}</p>}
              </div>
            </div>
          )}

          {category === 'Bank Card' && (
            <div className="category-section">
              <h3>Bank Card Details</h3>
              <div className="form-group">
                <label className="required">Card Type</label>
                <select name="cardType" value={formData.cardType} onChange={handleInputChange}>
                  <option value="">Select card type</option>
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                  <option value="ATM">ATM</option>
                </select>
                {errors.cardType && <p className="error-text">{errors.cardType}</p>}
              </div>
              <div className="form-group">
                <label className="required">Name of the Bank</label>
                <input name="bankName" value={formData.bankName} onChange={handleInputChange} />
                {errors.bankName && <p className="error-text">{errors.bankName}</p>}
              </div>
              <div className="form-group">
                <label className="required">Last 4 digits of the card number</label>
                <input name="cardLast4" value={formData.cardLast4} onChange={handleInputChange} maxLength={4} />
                {errors.cardLast4 && <p className="error-text">{errors.cardLast4}</p>}
              </div>

              <div className="private-block">
                <h4>Private Fields (not shown publicly)</h4>
                <div className="form-group">
                  <label className="required">Location</label>
                  <input name="bankPrivateLocation" value={formData.bankPrivateLocation} onChange={handleInputChange} />
                  {errors.bankPrivateLocation && <p className="error-text">{errors.bankPrivateLocation}</p>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="required">Date</label>
                    <input type="date" name="bankPrivateDate" value={formData.bankPrivateDate} onChange={handleInputChange} />
                    {errors.bankPrivateDate && <p className="error-text">{errors.bankPrivateDate}</p>}
                  </div>
                  <div className="form-group">
                    <label className="required">Time</label>
                    <input type="time" name="bankPrivateTime" value={formData.bankPrivateTime} onChange={handleInputChange} />
                    {errors.bankPrivateTime && <p className="error-text">{errors.bankPrivateTime}</p>}
                  </div>
                </div>
                <div className="form-group">
                  <label>CVV number (optional)</label>
                  <input name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} maxLength={4} />
                </div>
              </div>
            </div>
          )}

          {category === 'Purse' && (
            <div className="category-section">
              <h3>Purse Details</h3>

              <div className="purse-options">
                <label>
                  <input
                    type="radio"
                    name="purseOption"
                    value="with-id"
                    checked={purseOption === 'with-id'}
                    onChange={(e) => setPurseOption(e.target.value)}
                  />
                  With Student / Staff ID or NIC
                </label>
                <label>
                  <input
                    type="radio"
                    name="purseOption"
                    value="without-id"
                    checked={purseOption === 'without-id'}
                    onChange={(e) => setPurseOption(e.target.value)}
                  />
                  Without Student / Staff ID or NIC
                </label>
              </div>

              {purseOption === 'with-id' && (
                <>
                  <div className="form-group">
                    <label className="required">Name</label>
                    <input name="purseName" value={formData.purseName} onChange={handleInputChange} />
                    {errors.purseName && <p className="error-text">{errors.purseName}</p>}
                  </div>
                  <div className="form-group">
                    <label className="required">Student ID or NIC number</label>
                    <input name="purseIdNumber" value={formData.purseIdNumber} onChange={handleInputChange} />
                    {errors.purseIdNumber && <p className="error-text">{errors.purseIdNumber}</p>}
                  </div>
                </>
              )}

              {purseOption === 'without-id' && (
                <div className="private-block">
                  <h4>Private Fields (not shown publicly)</h4>
                  <div className="form-group">
                    <label className="required">How much money is inside</label>
                    <input name="purseMoney" value={formData.purseMoney} onChange={handleInputChange} />
                    {errors.purseMoney && <p className="error-text">{errors.purseMoney}</p>}
                  </div>
                  <div className="form-group">
                    <label className="required">Other items inside the purse</label>
                    <textarea name="purseOtherItems" value={formData.purseOtherItems} onChange={handleInputChange} rows={3} />
                    {errors.purseOtherItems && <p className="error-text">{errors.purseOtherItems}</p>}
                  </div>
                  <div className="form-group">
                    <label className="required">Location</label>
                    <input name="pursePrivateLocation" value={formData.pursePrivateLocation} onChange={handleInputChange} />
                    {errors.pursePrivateLocation && <p className="error-text">{errors.pursePrivateLocation}</p>}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="required">Date</label>
                      <input type="date" name="pursePrivateDate" value={formData.pursePrivateDate} onChange={handleInputChange} />
                      {errors.pursePrivateDate && <p className="error-text">{errors.pursePrivateDate}</p>}
                    </div>
                    <div className="form-group">
                      <label className="required">Time</label>
                      <input type="time" name="pursePrivateTime" value={formData.pursePrivateTime} onChange={handleInputChange} />
                      {errors.pursePrivateTime && <p className="error-text">{errors.pursePrivateTime}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {category === 'Others' && (
            <div className="category-section">
              <h3>Other Item Details</h3>

              <div className="form-group">
                <label className="required">Upload Photo of the item</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {errors.otherPhoto && <p className="error-text">{errors.otherPhoto}</p>}
              </div>

              <div className="private-block">
                <h4>Private Fields (not shown publicly)</h4>
                <div className="form-group">
                  <label className="required">Location</label>
                  <input name="otherPrivateLocation" value={formData.otherPrivateLocation} onChange={handleInputChange} />
                  {errors.otherPrivateLocation && <p className="error-text">{errors.otherPrivateLocation}</p>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="required">Date</label>
                    <input type="date" name="otherPrivateDate" value={formData.otherPrivateDate} onChange={handleInputChange} />
                    {errors.otherPrivateDate && <p className="error-text">{errors.otherPrivateDate}</p>}
                  </div>
                  <div className="form-group">
                    <label className="required">Time</label>
                    <input type="time" name="otherPrivateTime" value={formData.otherPrivateTime} onChange={handleInputChange} />
                    {errors.otherPrivateTime && <p className="error-text">{errors.otherPrivateTime}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">Submit Report</button>
          </div>
        </form>

        {submitted && (
          <div className="status-card success">
            <p>Item successfully reported.</p>
            <button className="btn-primary" onClick={handleHandedOver}>Handed Over</button>
          </div>
        )}

        {handedOver && (
          <div className="status-card handed-over">
            <p>Item handed over to security.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFoundItem;
