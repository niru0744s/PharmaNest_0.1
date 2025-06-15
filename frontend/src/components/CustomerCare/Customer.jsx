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
  Box,
  Avatar,
  Paper,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useNavigate } from 'react-router-dom';

export default function Customer() {
  const theme = useTheme();
  const navigator = useNavigate();
  
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={8}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            [theme.breakpoints.down('sm')]: {
              fontSize: '2rem'
            }
          }}
        >
          Customer Care
        </Typography>
        <Typography 
          variant="h5" 
          component="p" 
          color="text.secondary"
          sx={{
            maxWidth: 800,
            margin: '0 auto',
            [theme.breakpoints.down('sm')]: {
              fontSize: '1.1rem'
            }
          }}
        >
          We're here to help with all your medicine and healthcare needs
        </Typography>
      </Box>

      {/* Contact Options */}
      <Grid container spacing={4} mb={8} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[6]
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
                  margin: '0 auto 16px'
                }}
              >
                <HeadsetMicIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom>
                24/7 Support
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Immediate assistance from our healthcare specialists
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                fullWidth
                href="tel:+917439893394"
                sx={{ py: 1.5 }}
              >
                +91 7439893394
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[6]
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: theme.palette.secondary.light,
                  color: theme.palette.secondary.main,
                  margin: '0 auto 16px'
                }}
              >
                <ChatIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom>
                Live Chat
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Instant help from our healthcare agents
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
                onClick={() => alert('Live chat initiated')}
              >
                Start Chat Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[6]
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: theme.palette.success.light,
                  color: theme.palette.success.main,
                  margin: '0 auto 16px'
                }}
              >
                <ContactMailIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom>
                Email Support
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Response within 24 hours
              </Typography>
              <Button 
                variant="contained" 
                color="success"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
                href="mailto:pharmanest002@gmail.com"
              >
                Email Us
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Advisor Section */}
      <Paper 
        elevation={4} 
        sx={{ 
          mb: 8, 
          p: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <Avatar
          sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'white',
            color: theme.palette.primary.main,
            margin: '0 auto 16px'
          }}
        >
          <SmartToyIcon fontSize="large" />
        </Avatar>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
          AI Health Advisor
        </Typography>
        <Typography variant="h6" component="p" mb={4} sx={{ opacity: 0.9 }}>
          Get instant advice about medicines and health concerns from our AI-powered healthcare assistant
        </Typography>
        <Button 
          variant="contained" 
          color="secondary"
          size="large"
          startIcon={<LocalHospitalIcon />}
          onClick={() => navigator("/aiAdvisor")}
          sx={{ 
            px: 6,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          CONSULT NOW
        </Button>
      </Paper>

      {/* FAQ Section */}
      <Box mb={8}>
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          textAlign="center"
          sx={{ fontWeight: 700, color: theme.palette.text.primary }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography 
          variant="h6" 
          component="p" 
          color="text.secondary" 
          textAlign="center"
          mb={6}
          sx={{ maxWidth: 700, margin: '0 auto' }}
        >
          Find quick answers to common questions about our services and products
        </Typography>
        
        <Box sx={{ maxWidth: 900, margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <Accordion 
              key={index} 
              sx={{ 
                mb: 2,
                borderRadius: '8px !important',
                overflow: 'hidden',
                '&:before': {
                  display: 'none'
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: theme.palette.grey[100],
                  '&:hover': {
                    bgcolor: theme.palette.grey[200]
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: theme.palette.grey[50] }}>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>

      {/* Contact Form */}
      <Box mb={4}>
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          textAlign="center"
          sx={{ fontWeight: 700, color: theme.palette.text.primary }}
        >
          Send Us a Message
        </Typography>
        <Typography 
          variant="h6" 
          component="p" 
          color="text.secondary" 
          textAlign="center"
          mb={6}
          sx={{ maxWidth: 700, margin: '0 auto' }}
        >
          Have a specific question? Fill out the form below and we'll get back to you soon
        </Typography>
        
        <Card 
          sx={{ 
            maxWidth: 800, 
            margin: '0 auto',
            boxShadow: theme.shadows[3],
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box component="form" sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item size={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item size={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item size={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item size={6}>
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item size={12}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    variant="outlined"
                    multiline
                    rows={6}
                    required
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    type="submit"
                    sx={{ 
                      px: 6,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    SEND MESSAGE
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}