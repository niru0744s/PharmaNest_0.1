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
                <div className="col-6 mt-5">
                    <div className='d-flex'>
                    <MailOutlineIcon fontSize='large' style={{"fontSize":"1.8rem"}}/>
                    <p style={{marginLeft:"10px"}} className='fs-5'>Sent a Message</p>
                    </div>
                    <form className='needs-validation d-flex' novalidate>
                        <input type="email" name="email" id="email" placeholder='Enter your email' className='px-3 me-3 rounded-2 border border-success border inp  form-control' required/>
                        <input type="text" name="text"  placeholder='Sent a Message' className='px-3 me-3 rounded-2 border-success border inp form-control' required/>
                          <button className='px-4 py-2 rounded-3 border border-white btnn'>
                            <TelegramIcon/>
                          </button>
                    </form>
                </div>
                <div className="col-6">
                    {/* <img src="media/images/medicine.svg" alt="medicine_svg" style={{"height":"15rem" , "width":"15rem"}} className='ms-4 mb-5 ' /> */}
                </div>
            </div>
            <div className="row">
                    <div className="col-4 mt-5">
                        <h4 className='mt-2'>PharmaNest</h4>
                        <p className='text-muted mt-4'> `Pharmanest: Your trusted online medical store 
                            for high-quality medicines, health supplies, and wellness essentials. 
                            We prioritize your health with a seamless shopping experience, 
                            secure payments, and reliable delivery services. 
                            Shop with confidence and stay healthy with Pharmanest.`
                        </p>
                        <div className='d-flex mt-2'>
                        <div className='cont'><FacebookOutlinedIcon style={{"color":"#fff"}} className='fs-2 icon'/></div>
                            <div className='cont'><TwitterIcon style={{"color":"#fff"}} className='fs-2 icon'/></div>
                            <div className='cont'><InstagramIcon style={{"color":"#fff"}} className='fs-2 icon'/></div>
                            <div className='cont'><LinkedInIcon style={{"color":"#fff"}} className='fs-2 icon'/></div>
                        </div>
                    </div>
                    <div className="col-8 mt-5 d-flex footer-links">
                        <div className='me-5 ms-5 '>
                            <p className='text-muted'>Aboutus</p>
                            <p className='text-muted'>Services</p>
                            <p className='text-muted'>Blog</p>
                            <p className='text-muted'>Contactus</p>
                        </div>
                        <div className='me-5 ms-5'>
                            <p className='text-muted'>Support</p>
                            <p className='text-muted'>Knowledge base</p>
                            <p className='text-muted'>Live Chat</p>
                        </div>
                        <div className='me-5 ms-5'>
                            <p className='text-muted'>Jobs</p>
                            <p className='text-muted'>Our Team</p>
                            <p className='text-muted'>Privacy Policy</p>
                            <p className='text-muted'>Leadership</p>
                        </div>
                        <div className='ms-5'>
                            <p className='text-muted'>Medicines</p>
                            <p className='text-muted'>Health</p>
                            <p className='text-muted'>Supplies</p>
                            <p className='text-muted'>Care</p>
                        </div>
                    </div>
            </div>
            <hr className='mt-5'/>
            <div className="col-6">
                <p className='text-muted'>Copyright ©2025. All Rights Reserved. Design & Build by <a href="https://www.linkedin.com/in/nirupam-bhattacharya-5a36a4257/" target='_blank' className='text-danger stratched-link' style={{"textDecoration":"none"}}>Nirupam Bhattacharya</a></p>
            </div>
            <div className="col-6"></div>
        </div>
        </div>
  )
}


