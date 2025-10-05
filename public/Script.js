// script.js - QUANTUM NEXUS ADVANCED CYBER THREAT MATRIX

// ============================================
// GLOBAL CONFIGURATION
// ============================================
const CONFIG = {
    simulation: {
        virusSpreadRate: 0.3,
        wormSpreadRate: 0.7,
        trojanSpreadRate: 0.2,
        animationSpeed: 1000,
        damageThreshold: 10, // Number of infected nodes to trigger damage popup
        criticalThreshold: 30 // Critical damage threshold
    },
    colors: {
        quantum: '#00ffff',
        purple: '#ff00ff',
        green: '#00ff88',
        red: '#ff0040',
        orange: '#ff6600'
    },
    sounds: {
        enabled: true,
        volume: 0.5
    }
};

// Global State
const STATE = {
    currentThreat: null,
    simulationActive: false,
    isPaused: false,
    infectedNodes: new Set(),
    networkNodes: [],
    startTime: null,
    elapsedTime: 0,
    statistics: {
        totalInfected: 0,
        infectionRate: 0,
        threatLevel: 0,
        systemHealth: 100
    },
    charts: {},
    threeDScene: null,
    damagePopupShown: false,
    criticalDamageShown: false
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApplication();
});

async function initializeApplication() {
    console.log('🚀 Initializing QUANTUM NEXUS...');
    
    // Start loading sequence
    await startLoadingSequence();
    
    // Initialize all systems
    initializeMatrixRain();
    initializeEventListeners();
    initializeNetworkGrid();
    initializeCharts();
    initializeTerminal();
    initializeFAB();
    initialize3DBackground();
    initializeParticles();
    
    // Remove loader
    setTimeout(() => {
        const loader = document.getElementById('quantumLoader');
        loader.classList.add('hidden');
        
        // Initialize AOS animations after loader
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
        }
    }, 3000);
}

// ============================================
// LOADING SEQUENCE
// ============================================
async function startLoadingSequence() {
    const progressBar = document.getElementById('loadingProgress');
    const percentage = document.getElementById('loadingPercentage');
    const status = document.getElementById('loadingStatus');
    
    const steps = [
        { text: 'Initializing Quantum Cores...', progress: 20 },
        { text: 'Loading Neural Networks...', progress: 40 },
        { text: 'Establishing Secure Connection...', progress: 60 },
        { text: 'Calibrating Defense Systems...', progress: 80 },
        { text: 'System Ready', progress: 100 }
    ];
    
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        // Update status text
        status.textContent = step.text;
        
        // Animate progress bar
        await animateProgress(progressBar, percentage, step.progress);
        
        // Activate modules
        if (step.progress >= 33) {
            document.getElementById('module1').classList.add('active');
        }
        if (step.progress >= 66) {
            document.getElementById('module2').classList.add('active');
        }
        if (step.progress >= 100) {
            document.getElementById('module3').classList.add('active');
        }
        
        await sleep(400);
    }
}

function animateProgress(bar, textElement, targetProgress) {
    return new Promise(resolve => {
        const currentProgress = parseInt(bar.style.width) || 0;
        const increment = (targetProgress - currentProgress) / 20;
        let progress = currentProgress;
        
        const interval = setInterval(() => {
            progress += increment;
            if (progress >= targetProgress) {
                progress = targetProgress;
                clearInterval(interval);
                resolve();
            }
            
            bar.style.width = `${progress}%`;
            textElement.textContent = `${Math.round(progress)}%`;
        }, 30);
    });
}

// ============================================
// MATRIX RAIN EFFECT
// ============================================
function initializeMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function drawMatrixRain() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrixRain, 35);
}

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const target = link.getAttribute('href');
            if (target && target !== '#') {
                document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
    
    // Fullscreen toggle
    document.getElementById('fullscreenToggle')?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
    
    // Threat selection - Fixed to use onclick from HTML
    window.selectThreatType = function(threatType) {
        selectThreat(threatType);
    };
    
    // Control buttons
    window.startSimulation = startSimulation;
    window.pauseSimulation = pauseSimulation;
    window.stopSimulation = stopSimulation;
    window.resetSimulation = resetSimulation;
    
    // Sliders
    const speedSlider = document.getElementById('speedSlider');
    const sizeSlider = document.getElementById('sizeSlider');
    
    speedSlider?.addEventListener('input', (e) => {
        document.getElementById('speedValue').textContent = e.target.value;
        CONFIG.simulation.animationSpeed = 2000 / parseInt(e.target.value);
    });
    
    sizeSlider?.addEventListener('input', (e) => {
        document.getElementById('sizeValue').textContent = e.target.value;
        initializeNetworkGrid();
    });
    
    // Report functions
    window.generateReport = generateReport;
    window.exportReport = exportReport;
    window.shareReport = shareReport;
    
    // Activity log
    window.clearLog = clearLog;
    
    // Terminal
    window.openTerminal = openTerminal;
    window.closeTerminal = closeTerminal;
    window.minimizeTerminal = minimizeTerminal;
    window.maximizeTerminal = maximizeTerminal;
    
    // Popup functions
    window.closeDamagePopup = closeDamagePopup;
    
    // Demo
    window.showDemo = showDemo;
    
    // Terminal input
    const terminalInput = document.getElementById('terminalInput');
    terminalInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeTerminalCommand(e.target.value);
            e.target.value = '';
        }
    });
}

// ============================================
// THREAT SELECTION
// ============================================
function selectThreat(threatType) {
    // Update state
    STATE.currentThreat = threatType;
    
    // Update UI
    document.querySelectorAll('.threat-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Find and select the clicked card
    const selectedCard = document.querySelector(`[onclick="selectThreatType('${threatType}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Update display
    document.getElementById('selectedThreatDisplay').textContent = 
        `Selected: ${threatType.toUpperCase()} - Ready to simulate`;
    
    // Show success notification
    showSuccessNotification(`${threatType.toUpperCase()} threat selected successfully`);
    
    // Log activity
    addActivityLog(`Threat module loaded: ${threatType.toUpperCase()}`, 'info');
    
    // Scroll to simulation section
    setTimeout(() => {
        document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
    
    // Play sound effect
    playSound('select');
}

// ============================================
// NETWORK GRID INITIALIZATION
// ============================================
function initializeNetworkGrid() {
    const container = document.getElementById('networkGrid');
    if (!container) return;
    
    const nodeCount = parseInt(document.getElementById('sizeSlider')?.value || 50);
    container.innerHTML = '';
    STATE.networkNodes = [];
    
    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'network-node';
        node.id = `node-${i}`;
        node.dataset.index = i;
        
        // Add click handler
        node.addEventListener('click', () => {
            if (STATE.simulationActive && !STATE.isPaused) {
                infectNode(i);
            }
        });
        
        container.appendChild(node);
        STATE.networkNodes.push({
            element: node,
            infected: false,
            index: i
        });
    }
    
    // Update protected count
    document.getElementById('protectedCount').textContent = nodeCount;
}

// ============================================
// SIMULATION CONTROL
// ============================================
function startSimulation() {
    if (!STATE.currentThreat) {
        showWarning('Please select a threat type first!');
        return;
    }
    
    if (STATE.simulationActive) return;
    
    STATE.simulationActive = true;
    STATE.isPaused = false;
    STATE.startTime = Date.now();
    STATE.damagePopupShown = false;
    STATE.criticalDamageShown = false;
    
    // Update UI
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('stopBtn').disabled = false;
    document.getElementById('resetBtn').disabled = true;
    
    // Update status
    const statusIndicator = document.getElementById('simStatus');
    statusIndicator.querySelector('.status-dot').style.background = '#ff0040';
    statusIndicator.querySelector('.status-text').textContent = 'ACTIVE';
    statusIndicator.classList.add('danger');
    
    // Log
    addActivityLog(`Simulation started: ${STATE.currentThreat.toUpperCase()} spreading...`, 'warning');
    
    // Start infection with patient zero
    const patientZero = Math.floor(Math.random() * STATE.networkNodes.length);
    infectNode(patientZero);
    
    // Start appropriate simulation
    switch (STATE.currentThreat) {
        case 'virus':
            startVirusSimulation();
            break;
        case 'worm':
            startWormSimulation();
            break;
        case 'trojan':
            startTrojanSimulation();
            break;
    }
    
    // Start timers
    startTimers();
    
    // Play sound
    playSound('start');
}

function startVirusSimulation() {
    STATE.simulationInterval = setInterval(() => {
        if (STATE.isPaused) return;
        
        const infected = Array.from(STATE.infectedNodes);
        infected.forEach(nodeIndex => {
            // Virus spreads to adjacent nodes
            const adjacent = getAdjacentNodes(nodeIndex);
            adjacent.forEach(adjIndex => {
                if (Math.random() < CONFIG.simulation.virusSpreadRate) {
                    infectNode(adjIndex);
                }
            });
        });
        
        updateStatistics();
        checkDamageThresholds();
    }, CONFIG.simulation.animationSpeed);
}

function startWormSimulation() {
    STATE.simulationInterval = setInterval(() => {
        if (STATE.isPaused) return;
        
        // Worm spreads rapidly to random nodes
        const uninfected = STATE.networkNodes
            .map((n, i) => i)
            .filter(i => !STATE.infectedNodes.has(i));
        
        if (uninfected.length > 0) {
            const infectCount = Math.min(
                Math.ceil(uninfected.length * CONFIG.simulation.wormSpreadRate * 0.1),
                uninfected.length
            );
            
            for (let i = 0; i < infectCount; i++) {
                const randomIndex = uninfected[Math.floor(Math.random() * uninfected.length)];
                infectNode(randomIndex);
            }
        }
        
        updateStatistics();
        checkDamageThresholds();
    }, CONFIG.simulation.animationSpeed);
}

function startTrojanSimulation() {
    STATE.simulationInterval = setInterval(() => {
        if (STATE.isPaused) return;
        
        // Trojan spreads slowly but stealthily
        if (Math.random() < CONFIG.simulation.trojanSpreadRate) {
            const uninfected = STATE.networkNodes
                .map((n, i) => i)
                .filter(i => !STATE.infectedNodes.has(i));
            
            if (uninfected.length > 0) {
                const targetIndex = uninfected[Math.floor(Math.random() * uninfected.length)];
                infectNode(targetIndex);
                
                // Add backdoor effect
                setTimeout(() => {
                    addActivityLog(`Backdoor installed on Node ${targetIndex}`, 'danger');
                }, 500);
            }
        }
        
        updateStatistics();
        checkDamageThresholds();
    }, CONFIG.simulation.animationSpeed);
}

function infectNode(index) {
    if (STATE.infectedNodes.has(index) || !STATE.networkNodes[index]) return;
    
    STATE.infectedNodes.add(index);
    const node = STATE.networkNodes[index];
    
    // Update visual
    node.element.classList.add('infected');
    node.element.classList.add('spreading');
    
    setTimeout(() => {
        node.element.classList.remove('spreading');
    }, 500);
    
    // Update stats
    document.getElementById('infectedCount').textContent = STATE.infectedNodes.size;
    document.getElementById('protectedCount').textContent = 
        STATE.networkNodes.length - STATE.infectedNodes.size;
    
    // Log infection
    addActivityLog(`Node ${index} compromised!`, 'danger');
    
    // Play sound
    playSound('infect');
}

function getAdjacentNodes(index) {
    const gridSize = Math.sqrt(STATE.networkNodes.length);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const adjacent = [];
    
    // Check all 4 directions
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    directions.forEach(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
            adjacent.push(newRow * gridSize + newCol);
        }
    });
    
    return adjacent;
}

function pauseSimulation() {
    STATE.isPaused = !STATE.isPaused;
    
    const pauseBtn = document.getElementById('pauseBtn');
    if (STATE.isPaused) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i><span>RESUME</span>';
        addActivityLog('Simulation paused', 'warning');
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>PAUSE</span>';
        addActivityLog('Simulation resumed', 'info');
    }
}

function stopSimulation() {
    STATE.simulationActive = false;
    STATE.isPaused = false;
    
    // Clear intervals
    clearInterval(STATE.simulationInterval);
    clearInterval(STATE.timerInterval);
    
    // Update UI
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('resetBtn').disabled = false;
    
    // Update status
    const statusIndicator = document.getElementById('simStatus');
    statusIndicator.querySelector('.status-dot').style.background = '#ff6600';
    statusIndicator.querySelector('.status-text').textContent = 'STOPPED';
    statusIndicator.classList.remove('danger');
    
    // Log
    addActivityLog('Simulation terminated', 'warning');
    addActivityLog(`Final infection count: ${STATE.infectedNodes.size}/${STATE.networkNodes.length} nodes`, 'info');
    
    // Show final report notification
    showSuccessNotification('Simulation completed! Check the report for details.');
}

function resetSimulation() {
    // Clear infected nodes
    STATE.infectedNodes.clear();
    STATE.networkNodes.forEach(node => {
        node.element.classList.remove('infected', 'spreading');
    });
    
    // Reset stats
    document.getElementById('infectedCount').textContent = '0';
    document.getElementById('protectedCount').textContent = STATE.networkNodes.length;
    document.getElementById('threatLevel').textContent = '0%';
    document.getElementById('simTime').textContent = '00:00';
    
    // Reset status
    const statusIndicator = document.getElementById('simStatus');
    statusIndicator.querySelector('.status-dot').style.background = '#00ff88';
    statusIndicator.querySelector('.status-text').textContent = 'READY';
    statusIndicator.classList.remove('danger');
    
    // Clear activity log
    clearLog();
    
    // Log
    addActivityLog('System reset complete', 'success');
    
    // Reset charts
    resetCharts();
}

// ============================================
// TIMERS & STATISTICS
// ============================================
function startTimers() {
    STATE.timerInterval = setInterval(() => {
        if (!STATE.isPaused && STATE.simulationActive) {
            const elapsed = Math.floor((Date.now() - STATE.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            document.getElementById('simTime').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function updateStatistics() {
    const totalNodes = STATE.networkNodes.length;
    const infectedCount = STATE.infectedNodes.size;
    
    // Calculate threat level
    const threatLevel = Math.round((infectedCount / totalNodes) * 100);
    document.getElementById('threatLevel').textContent = `${threatLevel}%`;
    
    // Update resource bars
    updateResourceBars(threatLevel);
    
    // Update charts
    updateCharts();
}

function updateResourceBars(threatLevel) {
    // CPU usage increases with threat level
    const cpuUsage = Math.min(95, threatLevel * 1.2);
    updateResourceBar('cpu', cpuUsage);
    
    // RAM usage
    const ramUsage = Math.min(90, threatLevel * 1.1);
    updateResourceBar('ram', ramUsage);
    
    // Network usage spikes during active spreading
    const netUsage = STATE.simulationActive ? Math.min(100, threatLevel * 1.5) : 20;
    updateResourceBar('net', netUsage);
    
    // Disk usage
    const diskUsage = Math.min(80, threatLevel * 0.8);
    updateResourceBar('disk', diskUsage);
}

function updateResourceBar(type, percentage) {
    const bar = document.getElementById(`${type}Bar`);
    const value = document.getElementById(`${type}Value`);
    
    if (bar && value) {
        bar.style.width = `${percentage}%`;
        value.textContent = `${Math.round(percentage)}%`;
        
        // Change color based on usage
        if (percentage > 80) {
            bar.style.background = 'linear-gradient(90deg, #ff0040, #ff6600)';
        } else if (percentage > 60) {
            bar.style.background = 'linear-gradient(90deg, #ff6600, #ffcc00)';
        }
    }
}

// ============================================
// DAMAGE THRESHOLDS & POPUPS
// ============================================
function checkDamageThresholds() {
    const infectedCount = STATE.infectedNodes.size;
    
    // Show damage popup at threshold
    if (infectedCount >= CONFIG.simulation.damageThreshold && !STATE.damagePopupShown) {
        STATE.damagePopupShown = true;
        showDamagePopup('WARNING', 'System integrity compromised!', {
            infected: infectedCount,
            total: STATE.networkNodes.length,
            percentage: Math.round((infectedCount / STATE.networkNodes.length) * 100)
        });
    }
    
    // Show critical damage at higher threshold
    if (infectedCount >= CONFIG.simulation.criticalThreshold && !STATE.criticalDamageShown) {
        STATE.criticalDamageShown = true;
        showDamagePopup('CRITICAL', 'SYSTEM CRITICALLY DAMAGED!', {
            infected: infectedCount,
            total: STATE.networkNodes.length,
            percentage: Math.round((infectedCount / STATE.networkNodes.length) * 100),
            severity: 'EXTREME'
        });
    }
    
    // Auto-stop if all nodes infected
    if (infectedCount >= STATE.networkNodes.length) {
        stopSimulation();
        showDamagePopup('FATAL', 'COMPLETE SYSTEM FAILURE!', {
            message: 'All nodes have been compromised. System is completely infected.'
        });
    }
}

function showDamagePopup(level, message, stats) {
    const popup = document.getElementById('damagePopup');
    const damageMessage = document.getElementById('damageMessage');
    const damageStats = document.getElementById('damageStats');
    
    // Update content
    damageMessage.textContent = message;
    
    // Build stats HTML
    let statsHTML = '';
    if (stats.infected !== undefined) {
        statsHTML += `<div>Infected Nodes: ${stats.infected}/${stats.total}</div>`;
    }
    if (stats.percentage !== undefined) {
        statsHTML += `<div>Infection Rate: ${stats.percentage}%</div>`;
    }
    if (stats.severity) {
        statsHTML += `<div>Severity: <span style="color: #ff0040">${stats.severity}</span></div>`;
    }
    if (stats.message) {
        statsHTML += `<div>${stats.message}</div>`;
    }
    
    damageStats.innerHTML = statsHTML;
    
    // Show popup
    popup.style.display = 'block';
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Play alert sound
    playSound('alert');
}

function closeDamagePopup() {
    const popup = document.getElementById('damagePopup');
    popup.classList.remove('show');
    setTimeout(() => {
        popup.style.display = 'none';
    }, 500);
}

// ============================================
// NOTIFICATIONS
// ============================================
function showWarning(message) {
    const overlay = document.getElementById('warningOverlay');
    const warningMessage = document.getElementById('warningMessage');
    
    warningMessage.textContent = message;
    overlay.style.display = 'block';
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }, 3000);
}

function showSuccessNotification(message) {
    const notification = document.getElementById('successNotification');
    const successMessage = document.getElementById('successMessage');
    
    successMessage.textContent = message;
    notification.style.display = 'flex';
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

// ============================================
// ACTIVITY LOG
// ============================================
function addActivityLog(message, type = 'info') {
    const logContent = document.getElementById('activityLog');
    const time = new Date().toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-message">${message}</span>
    `;
    
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
    
    // Limit log entries
    while (logContent.children.length > 50) {
        logContent.removeChild(logContent.firstChild);
    }
}

function clearLog() {
    const logContent = document.getElementById('activityLog');
    logContent.innerHTML = `
        <div class="log-entry info">
            <span class="log-time">${new Date().toLocaleTimeString()}</span>
            <span class="log-message">Activity log cleared</span>
        </div>
    `;
}

// ============================================
// CHARTS & VISUALIZATION
// ============================================
function initializeCharts() {
    const ctx = document.getElementById('timelineChart');
    if (!ctx) return;
    
    STATE.charts.timeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Infected Nodes',
                data: [],
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#00ffff'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#00ffff'
                    }
                }
            }
        }
    });
    
    // Initialize heatmap
    initializeHeatmap();
}

function updateCharts() {
    if (STATE.charts.timeline && STATE.simulationActive) {
        const chart = STATE.charts.timeline;
        const currentTime = new Date().toLocaleTimeString();
        
        chart.data.labels.push(currentTime);
        chart.data.datasets[0].data.push(STATE.infectedNodes.size);
        
        // Keep only last 20 data points
        if (chart.data.labels.length > 20) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        
        chart.update();
    }
    
    // Update heatmap
    updateHeatmap();
    
    // Update detection feed
    updateDetectionFeed();
}

function resetCharts() {
    if (STATE.charts.timeline) {
        STATE.charts.timeline.data.labels = [];
        STATE.charts.timeline.data.datasets[0].data = [];
        STATE.charts.timeline.update();
    }
}

function initializeHeatmap() {
    const container = document.getElementById('threatHeatmap');
    if (!container) return;
    
    // Create heatmap cells
    for (let i = 0; i < 50; i++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        container.appendChild(cell);
    }
}

function updateHeatmap() {
    const cells = document.querySelectorAll('.heatmap-cell');
    const threatLevel = (STATE.infectedNodes.size / STATE.networkNodes.length) * 100;
    
    cells.forEach((cell, index) => {
        const activity = Math.random() * threatLevel / 20;
        
        cell.className = 'heatmap-cell';
        if (activity > 4) cell.classList.add('level-5');
        else if (activity > 3) cell.classList.add('level-4');
        else if (activity > 2) cell.classList.add('level-3');
        else if (activity > 1) cell.classList.add('level-2');
        else if (activity > 0) cell.classList.add('level-1');
    });
}

function updateDetectionFeed() {
    const feed = document.getElementById('detectionFeed');
    if (!feed || Math.random() > 0.3) return; // Only update occasionally
    
    const messages = [
        { text: 'Suspicious network activity detected', type: 'warning' },
        { text: 'Malware signature identified', type: 'critical' },
        { text: 'Firewall breach attempt blocked', type: 'normal' },
        { text: 'Anomalous behavior detected in sector', type: 'warning' },
        { text: 'Security protocol engaged', type: 'normal' }
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    const time = new Date().toLocaleTimeString();
    
    const feedItem = document.createElement('div');
    feedItem.className = `feed-item ${message.type === 'critical' ? 'critical' : ''}`;
    feedItem.innerHTML = `
        <div class="feed-time">${time}</div>
        <div class="feed-message">${message.text}</div>
    `;
    
    feed.insertBefore(feedItem, feed.firstChild);
    
    // Keep only last 10 items
    while (feed.children.length > 10) {
        feed.removeChild(feed.lastChild);
    }
}

// ============================================
// REPORTS
// ============================================
function generateReport() {
    const reportContent = document.getElementById('reportContent');
    if (!reportContent) return;
    
    const report = {
        timestamp: new Date().toLocaleString(),
        threat: STATE.currentThreat || 'None',
        duration: STATE.startTime ? Math.floor((Date.now() - STATE.startTime) / 1000) : 0,
        totalNodes: STATE.networkNodes.length,
        infectedNodes: STATE.infectedNodes.size,
        infectionRate: ((STATE.infectedNodes.size / STATE.networkNodes.length) * 100).toFixed(2),
        threatLevel: Math.round((STATE.infectedNodes.size / STATE.networkNodes.length) * 100)
    };
    
    reportContent.innerHTML = `
        <div class="report-section">
            <h3>THREAT ANALYSIS REPORT</h3>
            <div class="report-meta">
                <p><strong>Generated:</strong> ${report.timestamp}</p>
                <p><strong>Threat Type:</strong> ${report.threat.toUpperCase()}</p>
                <p><strong>Simulation Duration:</strong> ${report.duration} seconds</p>
            </div>
        </div>
        
        <div class="report-section">
            <h4>INFECTION STATISTICS</h4>
            <div class="report-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Nodes:</span>
                    <span class="stat-value">${report.totalNodes}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Infected Nodes:</span>
                    <span class="stat-value" style="color: #ff0040">${report.infectedNodes}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Infection Rate:</span>
                    <span class="stat-value">${report.infectionRate}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Threat Level:</span>
                    <span class="stat-value" style="color: ${report.threatLevel > 50 ? '#ff0040' : '#ff6600'}">${report.threatLevel}%</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h4>RECOMMENDATIONS</h4>
            <ul>
                ${getRecommendations(report.threat, report.threatLevel)}
            </ul>
        </div>
        
        <div class="report-section">
            <h4>THREAT CHARACTERISTICS</h4>
            <p>${getThreatDescription(report.threat)}</p>
        </div>
    `;
    
    showSuccessNotification('Report generated successfully!');
}

function getRecommendations(threat, threatLevel) {
    let recommendations = [];
    
    if (threatLevel > 75) {
        recommendations.push('<li>CRITICAL: Immediate system isolation required</li>');
        recommendations.push('<li>Perform complete system scan and cleanup</li>');
        recommendations.push('<li>Restore from clean backup if available</li>');
    } else if (threatLevel > 50) {
        recommendations.push('<li>HIGH PRIORITY: Contain infection immediately</li>');
        recommendations.push('<li>Isolate infected nodes from network</li>');
        recommendations.push('<li>Deploy antivirus signatures</li>');
    } else if (threatLevel > 25) {
        recommendations.push('<li>MODERATE: Monitor and contain spread</li>');
        recommendations.push('<li>Update security definitions</li>');
        recommendations.push('<li>Scan connected systems</li>');
    } else {
        recommendations.push('<li>LOW: Continue monitoring</li>');
        recommendations.push('<li>Preventive security measures recommended</li>');
    }
    
    // Threat-specific recommendations
    if (threat === 'virus') {
        recommendations.push('<li>Update antivirus definitions</li>');
        recommendations.push('<li>Scan all executable files</li>');
    } else if (threat === 'worm') {
        recommendations.push('<li>Patch network vulnerabilities</li>');
        recommendations.push('<li>Implement network segmentation</li>');
    } else if (threat === 'trojan') {
        recommendations.push('<li>Check for backdoors and rootkits</li>');
        recommendations.push('<li>Monitor outbound connections</li>');
    }
    
    return recommendations.join('');
}

function getThreatDescription(threat) {
    const descriptions = {
        virus: 'A computer virus is a type of malware that, when executed, replicates by inserting copies of itself into other computer programs, data files, or the boot sector of the hard drive. Viruses often perform harmful activities on infected hosts, such as stealing hard disk space or CPU time, accessing private information, corrupting data, or displaying political or humorous messages.',
        worm: 'A computer worm is a standalone malware computer program that replicates itself in order to spread to other computers. Unlike a virus, it does not need to attach itself to an existing program. Worms almost always cause at least some harm to the network, even if only by consuming bandwidth.',
        trojan: 'A Trojan horse is any malware that misleads users of its true intent. Trojans are generally spread by some form of social engineering, for example where a user is duped into executing an email attachment disguised to appear not suspicious. Unlike viruses and worms, Trojans generally do not attempt to inject themselves into other files or otherwise propagate themselves.'
    };
    
    return descriptions[threat] || 'No threat selected.';
}

function exportReport() {
    const reportContent = document.getElementById('reportContent').innerText;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showSuccessNotification('Report exported successfully!');
}

function shareReport() {
    if (navigator.share) {
        navigator.share({
            title: 'Cyber Threat Analysis Report',
            text: 'Check out this threat analysis report from QUANTUM NEXUS',
            url: window.location.href
        }).then(() => {
            showSuccessNotification('Report shared successfully!');
        }).catch((error) => {
            console.error('Error sharing:', error);
        });
    } else {
        // Fallback - copy to clipboard
        const reportContent = document.getElementById('reportContent').innerText;
        navigator.clipboard.writeText(reportContent).then(() => {
            showSuccessNotification('Report copied to clipboard!');
        });
    }
}

// ============================================
// TERMINAL
// ============================================
function initializeTerminal() {
    const terminal = document.getElementById('terminalInterface');
    if (terminal) {
        terminal.style.display = 'none';
    }
}

function openTerminal() {
    const terminal = document.getElementById('terminalInterface');
    terminal.style.display = 'block';
    terminal.classList.add('active');
    document.getElementById('terminalInput').focus();
}

function closeTerminal() {
    const terminal = document.getElementById('terminalInterface');
    terminal.classList.remove('active');
    terminal.style.display = 'none';
}

function minimizeTerminal() {
    const terminal = document.getElementById('terminalInterface');
    terminal.style.height = '40px';
}

function maximizeTerminal() {
    const terminal = document.getElementById('terminalInterface');
    terminal.style.height = 'auto';
}

function executeTerminalCommand(command) {
    const output = document.getElementById('terminalOutput');
    
    // Add command to output
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.textContent = `nexus@quantum:~$ ${command}`;
    output.appendChild(commandLine);
    
    // Process command
    const response = processCommand(command.toLowerCase().trim());
    
    // Add response
    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-line';
    responseLine.textContent = response;
    output.appendChild(responseLine);
    
    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
}

function processCommand(command) {
    const commands = {
        'help': 'Available commands: help, status, clear, scan, report, exit',
        'status': `System Status: ${STATE.simulationActive ? 'SIMULATION ACTIVE' : 'IDLE'}\nThreat: ${STATE.currentThreat || 'None'}\nInfected Nodes: ${STATE.infectedNodes.size}`,
        'clear': () => {
            document.getElementById('terminalOutput').innerHTML = '';
            return 'Terminal cleared';
        },
        'scan': `Scanning network...\nNodes: ${STATE.networkNodes.length}\nInfected: ${STATE.infectedNodes.size}`,
        'report': () => {
            generateReport();
            return 'Report generated';
        },
        'exit': () => {
            closeTerminal();
            return 'Closing terminal...';
        }
    };
    
    if (commands[command]) {
        return typeof commands[command] === 'function' ? commands[command]() : commands[command];
    }
    
    return `Command not found: ${command}. Type 'help' for available commands.`;
}

// ============================================
// FAB MENU
// ============================================
function initializeFAB() {
    window.toggleFabMenu = function() {
        const fabMain = document.getElementById('fabMain');
        const fabMenu = document.getElementById('fabMenu');
        
        fabMain.classList.toggle('active');
        fabMenu.classList.toggle('active');
    };
    
    window.toggleSound = function() {
        CONFIG.sounds.enabled = !CONFIG.sounds.enabled;
        showSuccessNotification(`Sound ${CONFIG.sounds.enabled ? 'enabled' : 'disabled'}`);
    };
    
    window.showHelp = function() {
        showWarning('Help: Select a threat type, then click START to begin the simulation. Watch as the malware spreads through the network!');
    };
    
    window.showSettings = function() {
        showWarning('Settings panel coming soon!');
    };
}

// ============================================
// 3D BACKGROUND
// ============================================
function initialize3DBackground() {
    const canvas = document.getElementById('bgCanvas3D');
    if (!canvas) return;
    
    // Placeholder for 3D background effects
    // Could implement Three.js background here
}

// ============================================
// PARTICLES
// ============================================
function initializeParticles() {
    const container = document.getElementById('cyberParticles');
    if (!container) return;
    
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00ffff;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particle-float ${10 + Math.random() * 20}s linear infinite;
            opacity: ${0.3 + Math.random() * 0.7};
        `;
        container.appendChild(particle);
    }
}

// ============================================
// SOUND EFFECTS
// ============================================
function playSound(type) {
    if (!CONFIG.sounds.enabled) return;
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const sounds = {
        select: { frequency: 600, duration: 100 },
        infect: { frequency: 400, duration: 150 },
        start: { frequency: 800, duration: 200 },
        alert: { frequency: 300, duration: 500 }
    };
    
    const sound = sounds[type] || sounds.select;
    
    oscillator.frequency.value = sound.frequency;
    gainNode.gain.value = CONFIG.sounds.volume;
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration / 1000);
    
    setTimeout(() => oscillator.stop(), sound.duration);
}

// ============================================
// DEMO MODE
// ============================================
function showDemo() {
    showWarning('Demo mode will automatically showcase all threat types. Coming soon!');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize particle float animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-float {
        from {
            transform: translateY(100vh) translateX(-50px);
        }
        to {
            transform: translateY(-100vh) translateX(50px);
        }
    }
`;
document.head.appendChild(style);

// Log initialization complete
console.log('✅ QUANTUM NEXUS initialized successfully!');
// Example API call
fetch('http://localhost:5000/api/simulation/start', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        threat_type: 'virus',
        patient_zero: 0
    })
})
.then(response => response.json())
.then(data => console.log(data));
