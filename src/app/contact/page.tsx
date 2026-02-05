"use client";

import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Wrapper from "../wrapper";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: {
            main: "#53d6ff",
          },
          background: {
            default: "#090b10",
            paper: "rgba(16, 20, 26, 0.72)",
          },
          text: {
            primary: "#f3f6ff",
            secondary: "#b8c0d9",
          },
        },
        typography: {
          fontFamily: "var(--font-geist-sans), sans-serif",
          h1: {
            fontSize: "2.5rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
          },
        },
        components: {
          MuiTextField: {
            defaultProps: {
              variant: "filled",
              fullWidth: true,
            },
          },
          MuiFilledInput: {
            styleOverrides: {
              root: {
                backgroundColor: "rgba(8, 12, 18, 0.8)",
                borderRadius: 14,
                border: "1px solid rgba(120, 150, 200, 0.2)",
                transition: "border-color 200ms ease, box-shadow 200ms ease",
                overflow: "hidden",
              },
              input: {
                padding: "16px 18px",
              },
              multiline: {
                padding: 0,
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: "rgba(200, 210, 230, 0.8)",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 999,
                padding: "12px 28px",
                textTransform: "none",
                fontWeight: 600,
                letterSpacing: "0.01em",
              },
              contained: {
                boxShadow: "0 10px 30px rgba(83, 214, 255, 0.28)",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 24,
                border: "1px solid rgba(120, 160, 220, 0.25)",
                backdropFilter: "blur(18px)",
              },
            },
          },
        },
      }),
    []
  );

  const isValid = () => {
    return name && email && subject && message;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        // Or use a Server Action
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, subject }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper intialSection={"about"}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            py: { xs: 8, md: 12 },
            position: "relative",
            overflow: "hidden",
            background: "radial-gradient(60% 50% at 50% 0%, rgba(83, 214, 255, 0.2) 0%, rgba(9, 11, 16, 0.9) 60%), linear-gradient(120deg, rgba(10, 14, 20, 0.95), rgba(6, 8, 12, 0.98))",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(600px 300px at 30% 20%, rgba(120, 100, 255, 0.2), transparent 60%), radial-gradient(500px 260px at 70% 30%, rgba(83, 214, 255, 0.18), transparent 65%)",
              opacity: 0.9,
              pointerEvents: "none",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
              opacity: 0.25,
              pointerEvents: "none",
            },
          }}
        >
          <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 } }}>
              <Stack spacing={3} component="form" onSubmit={onSubmit}>
                <Box>
                  <Typography variant="h1" sx={{ mb: 1 }}>
                    {!successMessage ? "Contact Me" : "Thank you!"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {!successMessage
                      ? "Tell me about your project or idea, and I will follow up soon."
                      : "I'll get back to you as soon as possible."}
                  </Typography>
                </Box>

                {!successMessage && (
                  <Stack spacing={2}>
                    <TextField
                      label="Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                    <TextField
                      label="Email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                    <TextField
                      label="Subject"
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                    <TextField
                      label="Message"
                      required
                      multiline
                      minRows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!isValid() || loading}
                      sx={{
                        alignSelf: "flex-start",
                        mt: 1,
                        boxShadow:
                          "0 12px 30px rgba(83, 214, 255, 0.3), inset 0 0 0 1px rgba(255,255,255,0.1)",
                        "&:hover": {
                          boxShadow:
                            "0 16px 40px rgba(83, 214, 255, 0.45), inset 0 0 0 1px rgba(255,255,255,0.2)",
                        },
                      }}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Stack>
                )}

                {successMessage && (
                  <Alert
                    severity="success"
                    sx={{
                      bgcolor: "rgba(83, 214, 255, 0.12)",
                      color: "text.primary",
                      border: "1px solid rgba(83, 214, 255, 0.35)",
                    }}
                  >
                    {successMessage || "Thanks for reaching out."}
                  </Alert>
                )}

                {errorMessage && (
                  <Alert
                    severity="error"
                    sx={{
                      bgcolor: "rgba(255, 102, 102, 0.1)",
                      color: "text.primary",
                      border: "1px solid rgba(255, 102, 102, 0.35)",
                    }}
                  >
                    {errorMessage}
                  </Alert>
                )}
              </Stack>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    </Wrapper>
  );
}

export default ContactForm;
