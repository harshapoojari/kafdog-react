import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Form, Alert, Button, Container, Dropdown, Modal } from 'react-bootstrap';
import { data } from 'react-router-dom';
// import {useLocation } from 'react-router-dom';

const Produce = () => {

// const location = useLocation();
// const { broker } = location.state || {};
const [inputBroker, setInputBroker] = useState('');
const [broker,setBroker]=useState();
const [topic,setTopic]=useState();
const [message,setMessage]=useState('')
const [topics,setTopics]=useState([]);
const [showAlert,setShowAlert]=useState(false);
const [alertMessage,setAlertMessage]=useState('');
const [alertVariant,setAlertVariant]=useState('');
const [createModal,setCreateModal]=useState(false);
const [createTopicName,setCreateTopicName]=useState('')
const [topicCreated, setTopicCreated] = useState(false);

useEffect(()=>{
    if(broker)
    axios.get(`http://localhost:9098/api/v1/getTopics/${broker}`).then(res=>{
        setTopics(res.data)
    }).catch(err=>{
        if(err){
            setShowAlert(true);
            setAlertMessage(`Error: ${err.response.data}`)
            setAlertVariant('danger')
        }
        
    })
   },[broker,topicCreated])

   const produceMessage=async ()=>{
    try {
        if (!broker || !topic || !message) {
            alert('Please fill in all fields!');
            return;
          }
        const data=await axios.post('http://localhost:9098/api/v1/produce',{broker,topic,message});
        setTopic('');
        setMessage('');
        setShowAlert(true);
        setAlertMessage("Message produced successfully")
        setAlertVariant('success')
        setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
        console.log(error)
    }    
    
    }

    const createTopic=async ()=>{
    try {
        const res=await axios.post("http://localhost:9098/api/v1/createTopic",{
            "brokerName":broker,
            "topicName":createTopicName
        });
        setCreateModal(false)
        setShowAlert(true);
        setAlertVariant('success')
        setAlertMessage(res.data)
        setTopicCreated(prev=>!prev)
    } catch (error) {
        console.log(error);
    }
    }

  return (
    <>
    <Container className="mt-4">
    <Form onSubmit={(e) => { e.preventDefault(); produceMessage(); }}>
     <Form.Label>Enter Broker link</Form.Label>   
     <Form.Control
     type='text'
     value={inputBroker}
     onChange={(e)=>setInputBroker(e.target.value)}
     onKeyDown={(e)=>{
        if(e.key==='Enter'){
            e.preventDefault();
            setBroker(inputBroker);
        }
     }}
     />
    {broker && <h3>Selected Broker: {broker}</h3>}

    {showAlert && <Alert variant={alertVariant}>{alertMessage}</Alert>}

    
      <Form.Group className="mb-3">
      {broker && <Button className='my-4' onClick={()=>{setCreateModal(true)}}>Create Topic</Button>}  
        <Dropdown className='mt-2'>
            <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
            {topic || 'select topic'}
            </Dropdown.Toggle>
        <Dropdown.Menu>
            {topics.map((topic,index)=>(
                <Dropdown.Item 
                id={index}
                onClick={()=>setTopic(topic)}
                >{topic}</Dropdown.Item>
            ))}
        </Dropdown.Menu>
    </Dropdown>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Enter Message</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type='submit'>
        Produce
      </Button>
    </Form>
  </Container>

  <Modal show={createModal} onHide={()=>setCreateModal(false)}>
 <Modal.Body>
  <Form.Label>Enter topic name</Form.Label>  
  <Form.Control
  type='text'
  value={createTopicName}
  onChange={(e)=>{setCreateTopicName(e.target.value)}}
  >
  </Form.Control>
 </Modal.Body>
 <Modal.Footer>
    <Button onClick={createTopic}>Create</Button>
    <Button variant='secondary' onClick={()=>{setCreateModal(false)}}>Close</Button>
 </Modal.Footer>
  </Modal>
  </>
);
};

export default Produce