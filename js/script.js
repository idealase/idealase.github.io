// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    // EmailJS initialization
    (function() {
        // Initialize EmailJS with your public key
        emailjs.init({
            publicKey: "sBWi2Myw71iv3sKXL"
        });
    })();
    
    // Get elements we'll work with
    const contactForm = document.getElementById('contact-form');
    const navLinks = document.querySelectorAll('nav a');
    const arrowCanvas = document.getElementById('arrowCanvas');
    
    // Create transition overlay element
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition';
    document.body.appendChild(transitionOverlay);
    
    // Handle page transitions
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply transition for navigation between pages (not for hash links)
            if (!href.startsWith('#')) {
                e.preventDefault();
                
                // Animate current page sliding out to the left
                document.body.style.transform = 'translateX(-100%)';
                
                // After a short delay, navigate to the new page
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            } else {
                // Handle same-page navigation (smooth scrolling)
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Handle page entry transition
    window.addEventListener('pageshow', function(e) {
        // Reset transform when the page is shown
        document.body.style.transform = 'translateX(0)';
    });
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading indication
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Service ID, Template ID and template parameters
            const serviceID = "service_szc0b2r";
            const templateID = "template_zxvpn0b";
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message
            };
            
            // Send email using EmailJS
            emailjs.send(serviceID, templateID, templateParams)
                .then(function() {
                    console.log('Email sent successfully!');
                    alert('Thank you for your message! We will get back to you soon.');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('Email sending failed:', error);
                    alert('Failed to send the message. Error: ' + JSON.stringify(error));
                })
                .finally(function() {
                    // Restore button state
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }
    
    // Add a subtle animation to the header - dark mode version
    const header = document.querySelector('header');
    if (header) {
        setTimeout(() => {
            header.style.transition = 'background-color 1s ease';
            header.style.backgroundColor = '#252525';
        }, 500);
    }

    // Interactive arrow visualization
    if (arrowCanvas) {
        const ctx = arrowCanvas.getContext('2d');
        const centerX = arrowCanvas.width / 2;
        const centerY = arrowCanvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        // Arrow properties
        const arrowLength = radius - 10;
        let arrowAngle = 0;
        const arrowHeadSize = 15;
        
        // Colors for the visualization
        const circleColor = '#333333';
        const arrowColor = '#88c0d0';
        const centerDotColor = '#5e81ac';
        const tickColor = '#444444';
        
        // Draw the initial arrow pointing up (0 degrees)
        drawArrow(0);
        
        // Track mouse movement globally (across the entire document)
        document.addEventListener('mousemove', function(e) {
            // Get canvas position relative to the viewport
            const rect = arrowCanvas.getBoundingClientRect();
            const canvasCenterX = rect.left + centerX;
            const canvasCenterY = rect.top + centerY;
            
            // Calculate angle from canvas center to mouse position
            const dx = e.clientX - canvasCenterX;
            const dy = e.clientY - canvasCenterY;
            const angle = Math.atan2(dy, dx);
            
            // Draw the arrow at the calculated angle
            drawArrow(angle);
        });
        
        // Handle touch events for mobile users (entire document)
        document.addEventListener('touchmove', function(e) {
            // Don't prevent default here to allow page scrolling
            const touch = e.touches[0];
            
            // Get canvas position relative to the viewport
            const rect = arrowCanvas.getBoundingClientRect();
            const canvasCenterX = rect.left + centerX;
            const canvasCenterY = rect.top + centerY;
            
            const dx = touch.clientX - canvasCenterX;
            const dy = touch.clientY - canvasCenterY;
            const angle = Math.atan2(dy, dx);
            
            drawArrow(angle);
        });
        
        // Draw the arrow at the specified angle
        function drawArrow(angle) {
            // Clear the canvas
            ctx.clearRect(0, 0, arrowCanvas.width, arrowCanvas.height);
            
            // Draw tick marks around the circle
            drawTickMarks();
            
            // Calculate arrow end point
            const arrowEndX = centerX + Math.cos(angle) * arrowLength;
            const arrowEndY = centerY + Math.sin(angle) * arrowLength;
            
            // Draw arrow line
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(arrowEndX, arrowEndY);
            ctx.strokeStyle = arrowColor;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw arrow head
            drawArrowHead(arrowEndX, arrowEndY, angle, arrowHeadSize);
            
            // Draw center dot
            ctx.beginPath();
            ctx.arc(centerX, centerY, 5, 0, Math.PI * 2, false);
            ctx.fillStyle = centerDotColor;
            ctx.fill();
            
            // Display the angle in degrees
            // Add 90 degrees to fix the angle display (0 should be at the top)
            const degrees = Math.round(((angle + Math.PI/2) * 180 / Math.PI + 360) % 360);
            ctx.fillStyle = '#e1e1e1';
            ctx.font = '12px "Fira Code", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${degrees}°`, centerX, centerY + radius + 15);
        }
        
        // Draw tick marks around the circle to represent degrees
        function drawTickMarks() {
            ctx.strokeStyle = tickColor;
            ctx.lineWidth = 1;
            
            for (let i = 0; i < 36; i++) {
                const angle = (i * 10) * Math.PI / 180;
                
                const innerRadius = i % 9 === 0 ? radius - 10 : radius - 5;
                const startX = centerX + Math.cos(angle) * innerRadius;
                const startY = centerY + Math.sin(angle) * innerRadius;
                const endX = centerX + Math.cos(angle) * radius;
                const endY = centerY + Math.sin(angle) * radius;
                
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                
                // Add labels for cardinal directions
                if (i % 9 === 0) {
                    let label;
                    switch(i) {
                        case 0: label = 'E'; break;
                        case 9: label = 'S'; break;
                        case 18: label = 'W'; break;
                        case 27: label = 'N'; break;
                        default: label = '';
                    }
                    
                    const labelX = centerX + Math.cos(angle) * (radius - 20);
                    const labelY = centerY + Math.sin(angle) * (radius - 20);
                    
                    ctx.fillStyle = '#88c0d0';
                    ctx.font = '11px "Fira Code", monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(label, labelX, labelY);
                }
            }
        }
        
        // Draw the arrowhead
        function drawArrowHead(x, y, angle, size) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - size * Math.cos(angle - Math.PI / 6), 
                      y - size * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(x - size * Math.cos(angle + Math.PI / 6), 
                      y - size * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fillStyle = arrowColor;
            ctx.fill();
        }
    }
});