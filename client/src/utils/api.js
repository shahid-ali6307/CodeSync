const BASE_URL = "http://localhost:5000/api"

export async function signupUser(username, email, password) {
    const res = await fetch(`${BASE_URL}/auth/signup` , {
    method : 'POST' ,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
    })
    return res.json()
}

export async function loginUser(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
         method: 'POST' ,
         headers: { 'Content-Type' : 'application/json'},
         body: JSON.stringify({ email, password }),
    })
    return res.json()
}
