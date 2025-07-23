import validator from "validator";

export const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, gender, photoUrl, skills } =
    req.body;
  if (!firstName || !emailId) {
    throw new Error ('data is required.');
  }

  else if(!validator.isEmail(emailId)){
    throw new Error ('Enter valid email')
  }else if(!validator.isStrongPassword(password)){
    throw new Error ('Enter strong password.')
  }
};

export const validateSigninData=(req)=>{
    const { emailId, password} = req.body
    if( !emailId || !password){
        throw new Error ('Cant login. data error.')
    }
    
}


export const validateEditProfileData=(req)=>{
  
}
