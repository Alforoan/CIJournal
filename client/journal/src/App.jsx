import { useState } from 'react';
import './App.css'

function App() {

  const [title, setTitle] = useState(''); 
  const [errMsg, setErrMsg] = useState('');
  const [errMsgPara, setErrMsgPara] = useState('');

  const [paragraph, setParagraph] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("clicked");
    if (!title) {
      setErrMsg('Enter the title');
    } else {
      setErrMsg('');
    }
    if (!paragraph) {
      setErrMsgPara('Write something');
    } else {
      setErrMsgPara('');
    }


  }

  const handleTitleChange = (e) => {
    console.log(e.target.value);
    setTitle(e.target.value);
    setErrMsg('');
    
  }

  const handleParaChange = (e) => {
    setParagraph(e.target.value);
    setErrMsgPara('');
  }

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
        />
        <p style={{ color: 'red' }}>{errMsg}</p>
        <label htmlFor='journal'>Journal</label>
        <textarea
          onChange={handleParaChange}
          id='journal'
          style={{ height: '300px', width: '200px' }}
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
    </>
  );
}

export default App
