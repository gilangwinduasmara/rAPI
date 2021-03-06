import logo from './logo.svg';
import './App.css';
import data from './data/rest.json'
import { Col, Container, Form, FormControl, FormLabel, InputGroup, Row, Spinner } from 'react-bootstrap';
import SideMenu from './components/Sidemenu';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import 'react-json-pretty/themes/monikai.css';
import JSONPretty from 'react-json-pretty';

function App() {

  const [selectedResource, setSelectedResource] = useState(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)
  const [isFetching, setFetching] = useState(false)
  const [responseBody, setResponseBody] = useState(null)

  const onResourceItemClick = (resourceName) => {
    const resource = data.resources.filter((item) => (item.name==resourceName))[0]
    const model = data.models.filter((item) => (Object.keys(item)[0] ==resourceName))[0]
    resource.model = model[resource.name]
    console.log(resource)
    setSelectedResource(resource)
  }

  const onEndpointClick = (endpoint) => {
    console.log(endpoint)
    setSelectedEndpoint(endpoint)
  }

  const onButtonSubmit = () => {
    let endpoint=data.host+selectedEndpoint.url 
    if(selectedEndpoint.url_params){
      Object.keys(selectedEndpoint.url_params).map((key, index) => {
        console.log(key)
        endpoint = endpoint.replace(`{${key}}`, document.getElementsByName('url_params.'+key)[0].value)
        console.log(endpoint)
      })
    }

    const request = {
      method: selectedEndpoint.method,
    }
    if(selectedEndpoint.method != "GET"){
      request["body"] = document.getElementsByName('body')[0].value
    }
    console.log(endpoint)
    fetch(endpoint, request).then(res => {
      res.json().then(json => {
        console.log(endpoint)
        console.log(json)
        setResponseBody(json)
      })
    }).finally(() => {
      setFetching(false)
    })
    setFetching(true)
  }

  const checkField = (field="") => {
    if(field.startsWith('"!#')){
      field = field.replaceAll('!#', '')
      field = field.replaceAll('"', '')
      let tree = field.split(".")
      const model = data[tree[0]].filter((obj, i)=>(Object.keys(obj)[0] == tree[1]))[0]
      return JSON.stringify(model, null, 2)
    }else{
      return field
    }
  }

  return (
    <div className="App">
      <Container fluid className="p-0">
        <Row>
          <Col lg={2}>
            <SideMenu onResourceItemClick={onResourceItemClick}></SideMenu>
          </Col>
          <Col lg={10} style={{overflowY: 'scroll', maxHeight: '100vh', paddingTop: 100}}>
            <Row>
              <Col lg={12}>
                <div >
                  {
                    selectedResource ? (
                      <div>
                        <h1>{selectedResource.name}</h1>
                        <div>
                          {selectedResource.endpoints?.map((endpoint) => {
                            return(
                              <Row style={{cursor: 'pointer'}} onClick={() => onEndpointClick(endpoint)}>
                                <Col xs={1}>{endpoint.method}</Col>
                                <Col xs={5}>{endpoint.url}</Col>
                                <Col xs={3}>{endpoint.desc}</Col>
                              </Row>
                            )
                          })}
                        </div>
                      </div>
                    ): <div></div>
                  }
                </div>
              </Col>
              <Col lg={12}>
                {
                  selectedEndpoint && 
                  <div style={{paddingTop: 100}}>
                    <div style={{backgroundColor: '#505764', borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
                      <div style={{textAlign: 'center', padding: 8}}>{selectedEndpoint.desc}</div>
                      <div style={{backgroundColor: '#5f6570', padding: 8}}>
                        <div>parameter</div>
                          {
                            selectedEndpoint.url_params ?
                                Object.keys(selectedEndpoint.url_params).map((parameter, index) => {
                                return(
                                  <div>
                                    <Form.Group className="mb-3 mt-3">
                                      <Form.Label>{parameter}</Form.Label>
                                      <Form.Control
                                        placeholder={selectedEndpoint.url_params[parameter]}
                                        className="bg-dark"
                                        name={"url_params."+parameter}
                                      />
                                    </Form.Group>
                                  </div>
                                )
                              }):<div>No Url Param</div>
                          }
                          {
                            selectedEndpoint.body ? 
                                <Form.Group>
                                  <Form.Label>Body</Form.Label>
                                  <Form.Control className="bg-dark text-light" as="textarea" rows="3" name="body" value={checkField(JSON.stringify(selectedEndpoint.body))}/>
                              </Form.Group>
                
                            :<div>No Param</div>
                          }
                        <Button style={{marginTop: 24}} className="btn-dark" onClick={onButtonSubmit}>Submit</Button>
                        <div style={{marginTop: 24}}>
                          <div>Response</div>
                          {
                            isFetching ?
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 50}}>
                                <Spinner animation="border" />
                            </div> : null
                          }
                          <div style={{maxHeight: 400, overflowY: 'scroll'}}>
                            {
                              responseBody ?
                              <JSONPretty data={JSON.stringify(responseBody)}></JSONPretty> : null
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </Col>
              <Col lg={12}>
                {
                  selectedResource?.model &&(
                    <div>
                      <h4 style={{marginTop: 52}}>{selectedResource.name} Model</h4>
                      <div>Attribute</div>
                      {
                        Object.keys(selectedResource.model).map((attr, index) => {
                          return (
                            <div style={{marginLeft: 12, fontSize: 12}}>{attr} <span style={{fontSize: 10, opacity: .8}}>({selectedResource.model[attr]})</span></div>
                          )
                        })
                      }
                    </div>
                  )
                }
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
