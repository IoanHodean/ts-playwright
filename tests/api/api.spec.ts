import {test, expect, request} from '@playwright/test';
import { baseURL } from '../../api.config';


test.describe.parallel('API Tests', () => {      

test('GET request for list', async ({request}) => {
    const response= await request.get(`${baseURL}/users?page=2`);
    expect (response.status()).toBe(200);
    const responseBody = await response.json();
    

});
test ('Get request with invalid endpoint', async ({request}) => {
    const response= await request.get(`${baseURL}/users/nonexistent`);
    expect (response.status()).toBe(404);
});
test ('Get request of single user', async ({request}) => {
    const response= await request.get(`${baseURL}/users/2`);    
    expect (response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data.id).toBeTruthy();
    expect(responseBody.data.first_name).toBeTruthy();
    expect(responseBody.data.last_name).toBeTruthy();
    expect(responseBody.data.avatar).toBeTruthy();
    expect(responseBody.data.email).toBeTruthy();   
});
test ('validate all users in list', async ({request}) => {
    const response= await request.get(`${baseURL}/users?page=2`);
    expect (response.status()).toBe(200);
    const responseBody = await response.json();
    for (let i = 0; i < responseBody.data.length; i++) {
        expect(responseBody.data[i].id).toBeTruthy();
        expect(responseBody.data[i].first_name).toBeTruthy();
        expect(responseBody.data[i].last_name).toBeTruthy();
        expect(responseBody.data[i].avatar).toBeTruthy();
        expect(responseBody.data[i].email).toBeTruthy(); 
    }

});
test ('POST request to create user', async ({request}) => {
    const response= await request.post(`${baseURL}/users`, {
        data: {
            name: 'John Doe',
            job: 'Software Engineer'
        }
    });
    expect (response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.name).toBe('John Doe');
    expect(responseBody.job).toBe('Software Engineer');
});
test.fixme ('POST request to create user with falsy job', async ({request}) => {
    const response= await request.post(`${baseURL}/users`, {
        data: {
            name: 'John Doe',
            job: ''
        }
    });
    expect (response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe('Missing job title');
});
test.fixme ('POST request to create user with falsy name', async ({request}) => {
    const response= await request.post(`${baseURL}/users`, {
        data: {
            name: '',
            job: 'general manager'
        }
    });
    expect (response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe('Missing name');
});
test('POST request login', async ({request}) => {
    const response= await request.post(`${baseURL}/login`, {
        data: {
            email: 'eve.holt@reqres.in',
            password: 'cityslicka'
        }
    });
    expect (response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.token).toBeTruthy();
});
test ('PUT request to update user', async ({request}) => {
    const response= await request.put(`${baseURL}/users/2`, {
        data: {
            name: 'John Doe',
            job: 'Senior Software Engineer'
        }
    });
    expect (response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe('John Doe');
    expect(responseBody.job).toBe('Senior Software Engineer');        
});
test ('PATCH request to update user', async ({request}) => {
    const response= await request.patch(`${baseURL}/users/2`, {
        data: {
            name: 'John Doe',
            job: 'Senior Software Engineer'
        }
    });
    expect (response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.name).toBe('John Doe');
    expect(responseBody.job).toBe('Senior Software Engineer');        

});
test ('DELETE request to delete user', async ({request}) => {
    const response= await request.delete(`${baseURL}/users/2`);
    expect (response.status()).toBe(204);        
});
});
test.describe.parallel('Tests without authentication', () => {
test ('Testing GET endpoint without authentication', async ({request}) => {
    const response= await request.get(`${baseURL}/users`, {
        headers: {
          'x-api-key': '',
        }
    });
        expect (response.status()).toBe(401);              
    });
    test ('Testing POST endpoint without authentication', async ({request}) => {
        const response= await request.post(`${baseURL}/users`, {
            headers: {
              'x-api-key': '',
            },
            
            data: {
                name: 'John Doe',
                job: 'Software Engineer'
            }
        });   
        expect (response.status()).toBe(401);
    });
    test ('Testing PUT endpoint without authentication', async ({request}) => {
        const response= await request.put(`${baseURL}/users/2`, {
            headers: {
              'x-api-key': '',
            },
            
            data: {
                name: 'John Doe',
                job: 'Senior Software Engineer'
            }
        });   
        expect (response.status()).toBe(401);
    });
    test ('Testing PATCH endpoint without authentication', async ({request}) => {
        const response= await request.patch(`${baseURL}/users/2`, {
            headers: {
              'x-api-key': '',
            },
            
            data: {
                name: 'John Doe',
                job: 'Senior Software Engineer'
            }
        });   
        expect (response.status()).toBe(401);
    }
    );
    test ('Testing DELETE endpoint without authentication', async ({request}) => {
        const response= await request.delete(`${baseURL}/users/2`, {
            headers: {
              'x-api-key': '',
            }
        });   
        expect (response.status()).toBe(401);
    });  
    });
