import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './GlobeTrekPlanner.css';
// 🌟 Fixed: useNavigate import configuration verified
import { useNavigate } from 'react-router-dom';

// 🌟 Fixed: Removed { onBack } prop because we use route shifting now
export default function GlobeTrekPlanner() {
  // Input Form States
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('1'); 
  const [activityName, setActivityName] = useState('');
  const [timing, setTiming] = useState('');
  const [activityDate, setActivityDate] = useState(''); 
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState(''); 
  const [activeViewDay, setActiveViewDay] = useState('1');

  // Validation States (To toggle red borders)
  const [errors, setErrors] = useState({
    day: false,
    name: false,
    date: false,
    time: false,
    price: false,
    description: false
  });

  // INITIAL STATE: LocalStorage load logic
  const [activities, setActivities] = useState(() => {
    const savedActivities = localStorage.getItem('globetrek_activities');
    return savedActivities ? JSON.parse(savedActivities) : [];
  });

  // DYNAMIC STATE: For locked dates per day
  const [dayDates, setDayDates] = useState(() => {
    const savedDates = localStorage.getItem('globetrek_day_dates');
    return savedDates ? JSON.parse(savedDates) : {};
  });

  // AUTO SAVE LOGIC: Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('globetrek_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('globetrek_day_dates', JSON.stringify(dayDates));
  }, [dayDates]);

  // AUTO-FILL LOGIC: Auto dates filler
  useEffect(() => {
    const trimmedDay = selectedDay.trim();
    if (dayDates[trimmedDay]) {
      setActivityDate(dayDates[trimmedDay]); 
      setErrors(prev => ({ ...prev, date: false }));
    } else {
      setActivityDate(''); 
    }
  }, [selectedDay, dayDates]);

  // WORD COUNT TRACKER FUNCTION
  const countWords = (text) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  // Handle description change with real-time border tracking
  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = countWords(text);
    
    setErrors(prev => ({ ...prev, description: words > 30 }));
    setDescription(text);
  };

  // Extract unique days dynamically
  const existingDays = Array.from(new Set(activities.map((act) => act.day))).sort((a, b) => Number(a) - Number(b));

  // CUSTOM VALIDATION & FORM SUBMISSION HANDLER
  const handleAddActivity = (e) => {
    e.preventDefault(); 

    const currentErrors = {
      day: !selectedDay.trim(),
      name: !activityName.trim(),
      date: !activityDate,
      time: !timing.trim(),
      price: !price.trim() || Number(price) < 0,
      description: countWords(description) > 30
    };

    setErrors(currentErrors);

    // 🚨 1. SweetAlert2 Popup for Missing Fields
    if (currentErrors.day || currentErrors.name || currentErrors.date || currentErrors.time || currentErrors.price) {
      Swal.fire({
        title: 'Uh oh!',
        text: 'Please fill all required fields (Day, Activity Name, Date, Timing, and Price) properly before adding to timeline.',
        icon: 'error',
        confirmButtonColor: '#047857',
        customClass: {
          popup: 'gt-swal-popup'
        }
      });
      return;
    }

    // 🚨 2. SweetAlert2 Popup for Description Word Limit
    if (currentErrors.description) {
      Swal.fire({
        title: 'Limit Exceeded!',
        text: 'Only 30 words is allowed to write in short description section.',
        icon: 'warning',
        confirmButtonColor: '#047857',
        customClass: {
          popup: 'gt-swal-popup'
        }
      });
      return;
    }

    const currentDayKey = selectedDay.trim();
    
    if (activityDate && !dayDates[currentDayKey]) {
      setDayDates(prev => ({
        ...prev,
        [currentDayKey]: activityDate
      }));
    }

    const newActivity = {
      id: Date.now(),
      day: currentDayKey,
      date: activityDate,
      title: activityName.toUpperCase(),
      time: timing.trim(),
      cost: Number(price) || 0,
      desc: description.trim()
    };

    setActivities([...activities, newActivity]);
    setActiveViewDay(currentDayKey);

    // Form resetting
    setActivityName('');
    setTiming('');
    setPrice('');
    setDescription('');
    setErrors({ day: false, name: false, date: false, time: false, price: false, description: false });
    setActivityDate(dayDates[currentDayKey] || '');
  };

  // SPECIFIC ACTIVITY DELETE HANDLER
  const handleDeleteActivity = (id) => {
    const updatedActivities = activities.filter((act) => act.id !== id);
    setActivities(updatedActivities);
    
    const remainingActivitiesForDay = updatedActivities.filter(act => act.day === activeViewDay);
    if (remainingActivitiesForDay.length === 0) {
      setDayDates(prev => {
        const copy = { ...prev };
        delete copy[activeViewDay];
        return copy;
      });
    }
  };

  // SWEETALERT2 INTEGRATION FOR CLEAR ALL PLAN
  const handleClearAll = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete entire itinerary plan?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'gt-swal-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setActivities([]);
        setDayDates({});
        setActiveViewDay('1');
        setSelectedDay('1');
        setDescription('');
        setErrors({ day: false, name: false, date: false, time: false, price: false, description: false });
        localStorage.removeItem('globetrek_activities');
        localStorage.removeItem('globetrek_day_dates');
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your plan deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#047857'
        });
      }
    });
  };

  // Filter items based on selected tab view
  const filteredActivities = activities.filter((act) => act.day === activeViewDay);

  // Total budget calculation
  const totalBudget = filteredActivities.reduce((sum, act) => sum + Number(act.cost), 0);

  return (
    <div className="planner-dashboard-layout">
      
      {/* 1. LEFT SIDE: CONTROL PANEL */}
      <aside className="planner-control-panel">
        <div className="panel-header">
          {/* 🌟 FIXED: Changed onClick to trigger navigate('/') for seamless home route switching */}
          <button type="button" className="back-home-btn" onClick={() => navigate('/')}>← Back</button>
          <h2>Planned Your Activity</h2>
        </div>

        <form onSubmit={handleAddActivity} className="planner-form" noValidate>
          
          {/* Day Input */}
          <div className="form-group">
            <label>Select Day</label>
            <input 
              type="number" 
              min="1"
              placeholder="e.g. 1" 
              value={selectedDay}
              onChange={(e) => {
                setSelectedDay(e.target.value);
                setErrors(prev => ({ ...prev, day: false }));
              }}
              className={errors.day ? 'input-error-border' : ''}
            />
          </div>

          {/* Name Input */}
          <div className="form-group">
            <label>Activity Name</label>
            <input 
              type="text" 
              placeholder="e.g. Eiffel Tower" 
              value={activityName}
              onChange={(e) => {
                setActivityName(e.target.value);
                setErrors(prev => ({ ...prev, name: false }));
              }}
              className={errors.name ? 'input-error-border' : ''}
            />
          </div>

          {/* Date & Time Input Row */}
          <div className="form-group row">
            <div>
              <label>Date</label>
              <input 
                type="date" 
                value={activityDate}
                onChange={(e) => {
                  setActivityDate(e.target.value);
                  setErrors(prev => ({ ...prev, date: false }));
                }}
                className={errors.date ? 'input-error-border' : ''}
              />
            </div>
            <div>
              <label>Timing</label>
              <input 
                type="text" 
                placeholder="2:00 PM" 
                value={timing}
                onChange={(e) => {
                  setTiming(e.target.value);
                  setErrors(prev => ({ ...prev, time: false }));
                }}
                className={errors.time ? 'input-error-border' : ''}
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="form-group">
            <div className="label-count-row">
              <label>Short Description (Optional)</label>
              <span className={`word-counter-badge ${errors.description ? 'limit-danger' : ''}`}>
                {countWords(description)}/30 words
              </span>
            </div>
            <textarea 
              placeholder="Add small notes or details about the activity..." 
              value={description}
              onChange={handleDescriptionChange}
              className={`form-textarea-input ${errors.description ? 'input-error-border' : ''}`}
              rows="3"
            />
          </div>

          {/* Price Input */}
          <div className="form-group">
            <label>Price ($)</label>
            <input 
              type="number" 
              placeholder="e.g. 45" 
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setErrors(prev => ({ ...prev, price: false }));
              }}
              className={errors.price ? 'input-error-border' : ''}
            />
          </div>

          <button type="submit" className="add-activity-btn">Add to Timeline</button>
        </form>

        {/* DAY NAVIGATION TABS */}
        {existingDays.length > 0 && (
          <div className="days-navigation-section">
            <hr className="divider-line" />
            <h3>Your Saved Days</h3>
            <div className="days-buttons-grid">
              {existingDays.map((dayNum) => (
                <button
                  key={dayNum}
                  type="button"
                  className={`day-tab-btn ${activeViewDay === dayNum ? 'active-tab' : ''}`}
                  onClick={() => {
                    setActiveViewDay(dayNum);
                    setSelectedDay(dayNum); 
                  }}
                >
                  Day {dayNum} Overview
                </button>
              ))}
            </div>

            <button type="button" className="clear-all-plan-btn" onClick={handleClearAll}>
              🗑️ Clear Entire Plan
            </button>
          </div>
        )}
      </aside>

      {/* 2. RIGHT SIDE: TIMELINE ROAD */}
      <main className="planner-timeline-area">
        <div className="live-budget-widget">
          <span className="budget-title">DAY {activeViewDay} BUDGET ESTIMATOR</span>
          <span className="budget-amount">${totalBudget}</span>
          <span className="budget-subtitle">Estimated Budget for This Day</span>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="empty-timeline-placeholder">
            <div className="placeholder-icon">🗺️</div>
            <h3>Your Timeline is Empty</h3>
            <p>Left panel par info fill karke <strong>"Add to Timeline"</strong> par click karein.</p>
          </div>
        ) : (
          <div className="s-timeline-wrapper">
            <div className="central-highway-road" />

            {filteredActivities.map((act, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={act.id} className={`timeline-node-row ${isEven ? 'row-left' : 'row-right'}`}>
                  
                  <div className="road-milestone-dot">
                    <span className="milestone-number">{index + 1}</span>
                  </div>

                  <div className="itinerary-card">
                    <button 
                      type="button"
                      className="delete-activity-badge" 
                      title="Delete Activity"
                      onClick={() => handleDeleteActivity(act.id)}
                    >
                      ×
                    </button>

                    <div className="card-header">
                      <span className="card-day">✈ DAY {act.day}</span>
                      <span className="card-date-badge">{act.date}</span>
                    </div>
                    <div className="card-body">
                      <span className="card-main-title">{act.title}</span>
                      {act.desc && <p className="card-description-text">{act.desc}</p>}
                      <div className="card-footer">
                        <span>⏰ {act.time}</span>
                        <span className="card-cost">${act.cost}</span>
                      </div>
                    </div>
                  </div>

                  {index < filteredActivities.length - 1 && (
                    <div className={`svg-curve-track ${isEven ? 'curve-to-right' : 'curve-to-left'}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}