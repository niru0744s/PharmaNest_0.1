import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import './Footer.css'

export default function Footer() {
  return (
    <div className='footerBody border-top mt-4'>
            <div className="container mt-5 mb-0">
            <div className="row ">
                <div className="col-lg-6 mt-5">
                    <div className='d-flex'>
                    <MailOutlineIcon fontSize='large' style={{"fontSize":"1.8rem","color":"#22C55E "}}/>
                    <p style={{marginLeft:"10px",color:"#F9FAFB"}} className='fs-4 fw-bold'>Sent us a message</p>
                    </div>
                    <form className='needs-validation d-flex' noValidate>
                        <input type="email" name="email" id="email" placeholder='Enter your email' className='px-3 me-3 rounded-2 border border-success border inp  form-control' required/>
                        <input type="text" name="text"  placeholder='Sent a Message' className='px-3 me-3 rounded-2 border-success border inp form-control' required/>
                          <button className='px-4 py-2 rounded-3 border border-white btnn'>
                            <TelegramIcon/>
                          </button>
                    </form>
                </div>
            </div>
            <div className="row mt-lg-5">
                    <div className="col-lg-4 col-md-12">
                        <h4 className='mt-2 fw-bold' style={{color:"#F9FAFB"}}>PharmaNest</h4>
                        <p className='mt-4' style={{color:"#D1D5DB"}}> `Pharmanest: Your trusted online medical store 
                            for high-quality medicines, health supplies, and wellness essentials. 
                            We prioritize your health with a seamless shopping experience, 
                            secure payments, and reliable delivery services. 
                            Shop with confidence and stay healthy with Pharmanest.`
                        </p>
                        <div className='d-flex mt-2'>
                        <div className='cont'><FacebookOutlinedIcon style={{"color":"#22C55E "}} className='fs-2 icon'/></div>
                            <div className='cont'><TwitterIcon style={{"color":"#22C55E "}} className='fs-2 icon'/></div>
                            <div className='cont'><InstagramIcon style={{"color":"#22C55E "}} className='fs-2 icon'/></div>
                            <div className='cont'><LinkedInIcon style={{"color":"#22C55E "}} className='fs-2 icon'/></div>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-12 footer-links">
                        <div className="row mt-4">
                            <div className='col-lg-3 col-md-6'>
                            <p className='f-links'>Aboutus</p>
                            <p className='f-links'>Services</p>
                            <p className='f-links'>Blog</p>
                            <p className='f-links'>Contactus</p>
                            </div>
                            <div className='col-lg-3 col-md-6'>
                            <p className='f-links'>Support</p>
                            <p className='f-links'>Knowledge base</p>
                            <p className='f-links'>Live Chat</p>
                            </div>
                            <div className='col-lg-3 col-md-6'>
                            <p className='f-links'>Jobs</p>
                            <p className='f-links'>Our Team</p>
                            <p className='f-links'>Privacy Policy</p>
                            <p className='f-links'>Leadership</p>
                            </div>
                            <div className='col-lg-3 col-md-6'>
                            <p className='f-links'>Medicines</p>
                            <p className='f-links'>Health</p>
                            <p className='f-links'>Supplies</p>
                            <p className='f-links'>Care</p>
                            </div>
                        </div>
                    </div>
            </div>
            <hr className='mt-5'/>
            <div>
                <p className='' style={{color:"#D1D5DB"}}>Copyright ©2025. All Rights Reserved. Design & Build by <a href="https://www.linkedin.com/in/nirupam-bhattacharya-5a36a4257/" target='_blank' className='text-danger stratched-link' style={{"textDecoration":"none",color:"#60A5FA"}}>Nirupam Bhattacharya</a></p>
            </div>
        </div>
        </div>
  )
}


