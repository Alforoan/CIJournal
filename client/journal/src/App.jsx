import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import fs from 'fs';

function App() {

  const [title, setTitle] = useState(''); 
  const [errMsg, setErrMsg] = useState('');
  const [errMsgPara, setErrMsgPara] = useState('');
  const [errMsgDate, setErrMsgDate] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [date, setDate] = useState('');
  const [journals, setJournals] = useState([]);


  const handleSubmit = async() => {
    
    
    const currentDate = new Date();
    console.log({currentDate});
    console.log("clicked");
    if (!title) {
      setErrMsg('Enter the title');
      return;
    } else {
      setErrMsg('');
    }
    if (!paragraph) {
      setErrMsgPara('Write something');
      return;
    } else {
      setErrMsgPara('');
    }
    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate();
      const journalDate = date ? date : month.length === 2 ? `${month}/${day}/${year}` : `0${month}/${day}/${year}`
      const response = await axios.post(
        'http://localhost:3000/api/journals',
        JSON.stringify({id: Math.random(),title: title,date:journalDate, journal: paragraph}),
        {
          headers: {"Content-Type": 'application/json'},
          withCredentials: true
        }
      );
      console.log(response.data); 
    } catch (error) {
      console.error('Error:', error);
    }


  }

  const validateTitleLength = (title) => {
    if (title.length > 25) {
      return '25 characters max!';
    }
    return '';
  };

   const isValidInput = (input) => {
     const pattern = /^[a-zA-Z0-9.,!?'"\s]+$/;
     console.log({input});
     console.log(pattern.test(input));
     return pattern.test(input);
   };

   const isValidDate = (curDate) => {
    const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
    


    for (let i = 0; i < curDate.length; i++) {
      const char = curDate[i];
      console.log(typeof char);

      if (i === 2 || i === 5) {
        if (char !== '/') {
          setErrMsgDate('Invalid format: Missing slash');
          return false;
        }
      } else if (isNaN(parseInt(char))) {
        console.log('Invalid character detected');
        return false;
      }
    }

    if (curDate.length === 10) {
      const year = parseInt(curDate.slice(6));
      const month = parseInt(curDate.slice(0, 2));
      const day = parseInt(curDate.slice(3, 5));

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; 
      const currentDay = currentDate.getDate();

      if (
        year > currentYear ||
        (year === currentYear && month > currentMonth) || (year === currentYear && month === currentMonth && day > currentDay)
      ) {
        console.log('Selected date is in the future');
        return false;
      }
      return pattern.test(curDate);
    }

    return true;
   };


  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const errorMessage = validateTitleLength(newTitle);

    if (errorMessage) {
      if (newTitle.length > 25) {
        e.preventDefault();
      }
      setErrMsg(errorMessage);
    } else {
      setTitle(newTitle);
      setErrMsg('');
    }
  };


  const handleParaChange = (e) => {

    const newEntry = e.target.value;
    if (!isValidInput(newEntry)) {
      e.preventDefault();
      setErrMsgPara('invalid characters detected');
      setParagraph('');
    } else {
      setParagraph(e.target.value);
      setErrMsgPara('');
    }
  }

  const handleDateChange = (e) => {
    console.log(e.target.value);
    const dateText = e.target.value;
    const isValidCurDate = isValidDate(dateText);
    if(!isValidCurDate){
      e.preventDefault();
      setErrMsgDate('enter valid date');
      setDate('');
    }
    else if(e.target.value.length > 10){
      console.log("something");
      e.preventDefault(); 
      setErrMsgDate('too many characters');
    }else{
      setDate(e.target.value);
      setErrMsgDate('');
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/journals', {
          withCredentials: true,
        });
        setJournals(response.data.journals);
      } catch (error) {
        console.error('Error fetching journals:', error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = () => {

  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/journals/${id}`);
      const updatedJournals = journals.filter((journal) => journal.id !== id);
      setJournals(updatedJournals);
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  return (
    <>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '200px',
          margin: 'auto',
        }}
      >
        <label htmlFor='title'>Title</label>
        <input
          id='title'
          type='text'
          style={{ width: '200px' }}
          onChange={handleTitleChange}
          value={title}
        />
        <p style={{ color: 'red' }}>{errMsg}</p>
        <label htmlFor="date">Date (MM/DD/YYYY)</label>
        <input placeholder='Leave empty for current date' id='date' type="text" value={date} onChange={handleDateChange}/>
        <p style={{color: 'red'}}>{errMsgDate}</p>
        <label htmlFor='journal'>Journal</label>
        <textarea
          onChange={handleParaChange}
          id='journal'
          style={{ height: '300px', width: '200px' }}
          value={paragraph}
        ></textarea>
        <p style={{ color: 'red' }}>{errMsgPara}</p>
        <button
          type='submit'
          style={{
            marginTop: '1rem',
            background: 'gray',
            color: 'black',
            width: '208px',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 6px',
            cursor: 'pointer',
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
      <div style={{display:'flex', justifyContent:'center', flexDirection:'column', margin:'auto', alignItems:'center', marginTop:'1rem'}}>
        {journals?.map((entry) => {
          
          return (
            <div style={{ border: '1px solid black', marginBottom: '1rem', width:"300px" }} key={entry.id}>
              <h2>{entry.title}</h2>
              <p>{entry.date}</p>
              <p>{entry.journal}</p>
              <button onClick={handleEdit}>Edit</button>
              <button onClick={() => handleDelete(entry.id)}>Delete</button>
            </div>
          );
         
        })}
      </div>
    </>
  );
}

export default App
