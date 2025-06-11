import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  TextField,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';

export default function Customer() {
  const categories = [
    { name: 'OTC Medicines', icon: <LocalHospitalIcon fontSize="large" /> },
    { name: 'First Aid', icon: <LocalHospitalIcon fontSize="large" /> },
    { name: 'Hygiene', icon: <LocalHospitalIcon fontSize="large" /> },
    { name: 'Baby Products', icon: <LocalHospitalIcon fontSize="large" /> },
    { name: 'Supplements', icon: <LocalHospitalIcon fontSize="large" /> },
    { name: 'Test Kits', icon: <LocalHospitalIcon fontSize="large" /> }
  ];

  const faqs = [
    {
      question: 'How do I track my medicine order?',
      answer: 'You can track your order through the tracking link sent to your email or in your account dashboard.'
    },
    {
      question: 'What is your return policy for medicines?',
      answer: 'Due to health regulations, medicines cannot be returned once purchased. However, we accept returns for other healthcare products within 7 days.'
    },
    {
      question: 'How can I consult with the AI Advisor?',
      answer: 'Click on the "CONSULT NOW" button in the AI Advisor section to start your consultation.'
    },
    {
      question: 'Are your medicines authentic?',
      answer: 'Yes, we source all our medicines directly from licensed manufacturers and distributors.'
    }
  ];

  return (
    <Container className="py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <Typography variant="h2" className="mb-3" style={{ color: '#1976d2' }}>
          Customer Care
        </Typography>
        <Typography variant="h5" className="mb-4">
          We're here to help with all your medicine and healthcare needs
        </Typography>
      </div>

      {/* Contact Options */}
      <Typography variant="h4" className="my-4" style={{ color: '#2e7d32' }}>
        Contact Options
      </Typography>
      <Grid container spacing={3} className="mb-5">
        <Grid item xs={12} md={4}>
          <Card className="h-100">
            <CardContent className="text-center">
              <ContactSupportIcon fontSize="large" className="mb-3" style={{ color: '#1976d2' }} />
              <Typography variant="h5" className="mb-2">Call Us</Typography>
              <Typography variant="body1" className="mb-3">24/7 Customer Support</Typography>
              <Button 
                variant="contained" 
                color="primary"
                href="tel:+18005551524"
              >
                +1 (800) 555-1524
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="h-100">
            <CardContent className="text-center">
              <ChatIcon fontSize="large" className="mb-3" style={{ color: '#1976d2' }} />
              <Typography variant="h5" className="mb-2">Live Chat</Typography>
              <Typography variant="body1" className="mb-3">Instant help from our agents</Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => alert('Live chat initiated')}
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="h-100">
            <CardContent className="text-center">
              <EmailIcon fontSize="large" className="mb-3" style={{ color: '#1976d2' }} />
              <Typography variant="h5" className="mb-2">Email Us</Typography>
              <Typography variant="body1" className="mb-3">Response within 24 hours</Typography>
              <Button 
                variant="contained" 
                color="primary"
                href="mailto:support@pharmanest.com"
              >
                support@pharmanest.com
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Advisor Section */}
      <Card className="mb-5" style={{ backgroundColor: '#f5f5f5' }}>
        <CardContent className="text-center py-4">
          <Typography variant="h4" className="mb-3" style={{ color: '#1976d2' }}>
            AI Health Advisor
          </Typography>
          <Typography variant="body1" className="mb-4">
            Get instant advice about medicines and health concerns from our AI-powered advisor
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<LocalHospitalIcon />}
            onClick={() => alert('AI Advisor consultation started')}
            href="#"
          >
            CONSULT NOW
          </Button>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Typography variant="h4" className="my-4" style={{ color: '#2e7d32' }}>
        Frequently Asked Questions
      </Typography>
      <div className="mb-5">
        {faqs.map((faq, index) => (
          <Accordion key={index} className="mb-2">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      {/* Contact Form */}
      <Typography variant="h4" className="my-4" style={{ color: '#2e7d32' }}>
        Send Us a Message
      </Typography>
      <Card className="mb-5">
        <CardContent>
          <Box component="form" className="p-3">
            <Grid container spacing={3}>
              {/* First Name and Last Name in 2x2 grid */}
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  required
                />
              </Grid>
              
              {/* Email and Subject in 2x2 grid */}
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  required
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <TextField
                  fullWidth
                  label="Subject"
                  variant="outlined"
                  required
                />
              </Grid>
              
              {/* Full-width Message field at bottom */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              
              {/* Submit button centered at bottom */}
              <Grid item xs={12} className="text-center">
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  type="submit"
                  sx={{ mt: 2 }}
                >
                  SEND MESSAGE
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
