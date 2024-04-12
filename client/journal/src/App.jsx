

function App() {
 
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
    <form style={{display:'flex', flexDirection:'column'}}>
      <label htmlFor='title'>Title</label>
      <input id='title' type='text' />
      <label htmlFor='journal'>Journal</label>
      <input id='journal' type='text' style={{height: '300px', width:'200px'}}/>
      <button type='submit' style={{marginTop:'1rem', background:'gray', color:'black'}}>Submit</button>
    </form>
      
    </>
  );
}

export default App
