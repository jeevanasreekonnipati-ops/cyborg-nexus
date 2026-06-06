document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Terminal Boot-up Loader
    const loader = document.getElementById('terminal-loader');
    const msgs = document.querySelectorAll('.sys-msg');
    const loadBar = document.querySelector('.loading-bar');
    const loadProgress = document.querySelector('.loading-progress');
    
    let msgIndex = 0;
    
    function showNextMsg() {
        if(msgIndex < msgs.length) {
            msgs[msgIndex].style.opacity = 1;
            msgIndex++;
            setTimeout(showNextMsg, 400 + Math.random() * 400); // Random delay
        } else {
            loadBar.style.opacity = 1;
            let progress = 0;
            const int = setInterval(() => {
                progress += Math.random() * 15;
                if(progress > 100) progress = 100;
                loadProgress.style.width = progress + '%';
                if(progress === 100) {
                    clearInterval(int);
                    setTimeout(() => {
                        loader.style.opacity = 0;
                        setTimeout(() => loader.style.display = 'none', 500);
                        initBackground(); // Init heavy canvas after loading
                    }, 500);
                }
            }, 100);
        }
    }
    
    // Start terminal sequence
    setTimeout(showNextMsg, 500);

    // 2. Custom Cursor (Global)
    const cursor = document.querySelector('.custom-cursor');
    const cursorGlow = document.querySelector('.cursor-glow');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let glowX = mouseX, glowY = mouseY;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if(cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
    });
    
    function animateCursor() {
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        if(cursorGlow) {
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveEls = document.querySelectorAll('a, button, .tilt-card');
    interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if(cursor) cursor.classList.add('hovering');
            if(cursorGlow) cursorGlow.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            if(cursor) cursor.classList.remove('hovering');
            if(cursorGlow) cursorGlow.classList.remove('hovering');
        });
    });

    // 3. Theme Toggle ("Combat Mode")
    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if(currentTheme === 'combat') {
            document.documentElement.removeAttribute('data-theme');
            themeToggleBtn.innerHTML = '⚡ COMBAT MODE';
        } else {
            document.documentElement.setAttribute('data-theme', 'combat');
            themeToggleBtn.innerHTML = '🌐 DEFAULT MODE';
        }
    });

    // 4. Interactive Neural Canvas Background
    function initBackground() {
        const canvas = document.getElementById('neural-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const nodes = [];
        const numNodes = Math.floor((width * height) / 15000); // Dynamic density
        
        for(let i=0; i<numNodes; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5
            });
        }
        
        function drawNetwork() {
            ctx.clearRect(0, 0, width, height);
            
            // Get current theme color for lines
            const isCombat = document.documentElement.getAttribute('data-theme') === 'combat';
            const baseColor = isCombat ? '255, 0, 60' : '0, 243, 255';
            
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                
                if(node.x < 0 || node.x > width) node.vx *= -1;
                if(node.y < 0 || node.y > height) node.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${baseColor}, 0.5)`;
                ctx.fill();
            });
            
            for(let i=0; i<nodes.length; i++) {
                for(let j=i+1; j<nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if(dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(${baseColor}, ${1 - dist/100})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
                
                // Interaction with mouse
                const mdx = nodes[i].x - mouseX;
                const mdy = nodes[i].y - mouseY;
                const mDist = Math.sqrt(mdx*mdx + mdy*mdy);
                if(mDist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(${baseColor}, ${0.8 - mDist/150})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
            requestAnimationFrame(drawNetwork);
        }
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        
        drawNetwork();
    }

    // 5. Diagnostics HUD Modal
    const diagBtn = document.getElementById('diagnostics-btn');
    const diagModal = document.getElementById('diagnostics-modal');
    const closeModal = document.getElementById('close-modal');
    
    diagBtn.addEventListener('click', () => {
        diagModal.classList.add('active');
        simulateDiagnostics();
    });
    closeModal.addEventListener('click', () => {
        diagModal.classList.remove('active');
    });
    
    function simulateDiagnostics() {
        const cpuBar = document.getElementById('cpu-bar');
        const cpuVal = document.getElementById('cpu-val');
        const memBar = document.getElementById('mem-bar');
        const memVal = document.getElementById('mem-val');
        const tempBar = document.getElementById('temp-bar');
        const tempVal = document.getElementById('temp-val');
        const log = document.getElementById('diag-log');
        
        // Random fluctuation interval
        const simInt = setInterval(() => {
            if(!diagModal.classList.contains('active')) {
                clearInterval(simInt);
                return;
            }
            
            let c = Math.floor(40 + Math.random() * 20);
            let m = Math.floor(70 + Math.random() * 15);
            let t = Math.floor(75 + Math.random() * 12);
            
            cpuBar.style.width = c + '%'; cpuVal.innerText = c + '%';
            memBar.style.width = m + '%'; memVal.innerText = m + '%';
            tempBar.style.width = t + '%'; tempVal.innerText = t + '°C';
            
            if(Math.random() > 0.8) {
                log.innerHTML += `> Processing neural node [${Math.random().toString(36).substr(2, 5).toUpperCase()}]...<br>`;
                log.scrollTop = log.scrollHeight;
            }
        }, 1000);
    }

    // 6. 3D Tilt Effect
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // 7. Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if(e.isIntersecting) {
                e.target.classList.add('show');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    // Glitch Text Hero
    const glitchText = document.querySelector('.glitch-text');
    setInterval(() => {
        if(Math.random() > 0.7) {
            glitchText.style.transform = `translate(${Math.random()*4-2}px, ${Math.random()*4-2}px)`;
            setTimeout(() => glitchText.style.transform = 'translate(0,0)', 100);
        }
    }, 2000);

    // 8. Real-Time Neural Comm Link (Socket.io)
    if(typeof io !== 'undefined') {
        const socket = io();
        const chatMessages = document.getElementById('chat-messages');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const activeNodesCounter = document.getElementById('active-nodes');
        
        // Minimize/Maximize Comm Link
        const toggleCommBtn = document.getElementById('toggle-comm');
        const commLink = document.getElementById('comm-link');
        toggleCommBtn.addEventListener('click', () => {
            commLink.classList.toggle('minimized');
            toggleCommBtn.innerText = commLink.classList.contains('minimized') ? '[+]' : '[-]';
        });

        // Update Active Nodes
        socket.on('active_nodes_update', (count) => {
            if(activeNodesCounter) {
                activeNodesCounter.innerText = count.toLocaleString();
            }
        });

        // Receive Chat Message
        socket.on('chat_message', (msg) => {
            const div = document.createElement('div');
            div.className = `chat-msg ${msg.isSystem ? 'system' : ''}`;
            div.innerHTML = `<span class="sender">${msg.sender}</span> <span class="text">${msg.text}</span>`;
            chatMessages.appendChild(div);
            // Auto scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });

        // Send Chat Message
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(chatInput.value.trim() !== '') {
                socket.emit('chat_message', chatInput.value);
                chatInput.value = '';
            }
        });
    } else {
        console.warn('Socket.io not found. Running in static mode.');
    }
});
