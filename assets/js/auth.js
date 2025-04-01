const api = "https://lin.com.ng/mailin"
const isAuth = async () =>{
  const req = await fetch(api+"/is_auth/"+window.localStorage.getItem("token"));
  const res = await req.json();
  return res.status;
}


