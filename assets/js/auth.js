var api = "https://lin.com.ng/mailin";
var isAuth = async () =>{
  const req = await fetch(api+"/is_auth/"+window.localStorage.getItem("token"));
  const res = await req.json();
  return res.status;
}


