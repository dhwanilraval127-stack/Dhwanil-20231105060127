# app.py - QUANTUM NEXUS Backend API + Frontend serving
# FOR EDUCATIONAL PURPOSES ONLY

from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS
import json
import time
import random
import threading
import uuid
from datetime import datetime
import io
import base64
import os

# Optional deps for charts/PDF (only needed for /api/report/*)
try:
    import numpy as np
    import matplotlib.pyplot as plt
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    REPORT_FEATURES = True
except Exception:
    REPORT_FEATURES = False

# Serve static frontend from ./public
app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)

# ============================================
# GLOBAL CONFIGURATION
# ============================================
class Config:
    SIMULATION_SETTINGS = {
        'virus': {
            'spread_rate': 0.3,
            'damage_rate': 0.5,
            'stealth': 0.2,
            'persistence': 0.7,
            'replication_speed': 'moderate'
        },
        'worm': {
            'spread_rate': 0.8,
            'damage_rate': 0.3,
            'stealth': 0.4,
            'persistence': 0.9,
            'replication_speed': 'fast'
        },
        'trojan': {
            'spread_rate': 0.2,
            'damage_rate': 0.8,
            'stealth': 0.9,
            'persistence': 0.6,
            'replication_speed': 'slow'
        }
    }
    MAX_NODES = 100
    NETWORK_TYPES = ['corporate', 'home', 'datacenter', 'cloud']

# ============================================
# SIMULATION ENGINE
# ============================================
class NetworkNode:
    def __init__(self, node_id):
        self.id = node_id
        self.infected = False
        self.infection_time = None
        self.security_level = random.uniform(0.3, 0.9)
        self.os_type = random.choice(['Windows', 'Linux', 'MacOS'])
        self.services = self._generate_services()
        self.connections = []
        self.data_value = random.uniform(0.1, 1.0)

    def _generate_services(self):
        possible_services = ['HTTP', 'SSH', 'FTP', 'SQL', 'RDP', 'SMTP']
        return random.sample(possible_services, random.randint(1, 4))

    def infect(self, threat_type):
        if not self.infected:
            self.infected = True
            self.infection_time = time.time()
            return True
        return False

    def to_dict(self):
        return {
            'id': self.id,
            'infected': self.infected,
            'infection_time': self.infection_time,
            'security_level': self.security_level,
            'os_type': self.os_type,
            'services': self.services,
            'data_value': self.data_value
        }

class NetworkSimulator:
    def __init__(self):
        self.nodes = {}
        self.simulation_id = None
        self.threat_type = None
        self.start_time = None
        self.is_running = False
        self.infection_timeline = []
        self.events = []
        self.statistics = {
            'total_nodes': 0,
            'infected_nodes': 0,
            'clean_nodes': 0,
            'infection_rate': 0,
            'damage_assessment': 0,
            'data_compromised': 0
        }

    def create_network(self, size=50):
        self.nodes = {}
        self.statistics['total_nodes'] = size
        self.statistics['clean_nodes'] = size
        self.statistics['infected_nodes'] = 0
        self.statistics['infection_rate'] = 0
        self.statistics['damage_assessment'] = 0
        self.statistics['data_compromised'] = 0
        self.infection_timeline = []
        self.events = []

        for i in range(size):
            node = NetworkNode(i)
            self.nodes[i] = node

        for i in range(size):
            num_connections = random.randint(2, min(5, size - 1))
            possible_connections = [j for j in range(size) if j != i]
            connections = random.sample(possible_connections, num_connections)
            self.nodes[i].connections = connections

        self._log_event("Network created", f"Created network with {size} nodes")

    def start_simulation(self, threat_type, patient_zero=None):
        if self.is_running:
            return False

        self.simulation_id = str(uuid.uuid4())
        self.threat_type = threat_type
        self.start_time = time.time()
        self.is_running = True
        self.infection_timeline = []
        self.events = []

        if patient_zero is None:
            patient_zero = random.randint(0, len(self.nodes) - 1)

        self.infect_node(patient_zero, initial=True)

        self.spreading_thread = threading.Thread(target=self._spread_infection, daemon=True)
        self.spreading_thread.start()

        self._log_event("Simulation started", f"Started {threat_type} simulation with patient zero: Node {patient_zero}")
        return True

    def stop_simulation(self):
        self.is_running = False
        self._log_event("Simulation stopped", f"Stopped after {self.get_elapsed_time():.2f} seconds")
        return self.get_statistics()

    def infect_node(self, node_id, initial=False):
        if node_id in self.nodes and not self.nodes[node_id].infected:
            node = self.nodes[node_id]
            infection_chance = Config.SIMULATION_SETTINGS[self.threat_type]['spread_rate']
            if initial or random.random() < (infection_chance * (1 - node.security_level)):
                node.infect(self.threat_type)
                self.statistics['infected_nodes'] += 1
                self.statistics['clean_nodes'] -= 1
                self.statistics['data_compromised'] += node.data_value

                self.infection_timeline.append({
                    'time': time.time() - self.start_time,
                    'node_id': node_id,
                    'total_infected': self.statistics['infected_nodes']
                })

                self._log_event("Node infected", f"Node {node_id} ({node.os_type}) compromised")
                self._trigger_threat_effects(node)
                return True
        return False

    def _spread_infection(self):
        while self.is_running:
            infected_nodes = [n for n in self.nodes.values() if n.infected]
            if not infected_nodes:
                time.sleep(0.1)
                continue

            if self.threat_type == 'virus':
                self._spread_virus(infected_nodes)
            elif self.threat_type == 'worm':
                self._spread_worm(infected_nodes)
            elif self.threat_type == 'trojan':
                self._spread_trojan(infected_nodes)

            self._update_statistics()

            if self.statistics['infected_nodes'] >= self.statistics['total_nodes']:
                self._log_event("Complete infection", "All nodes have been compromised")
                self.is_running = False

            speed = Config.SIMULATION_SETTINGS[self.threat_type]['replication_speed']
            sleep_time = {'fast': 0.5, 'moderate': 1.0, 'slow': 2.0}
            time.sleep(sleep_time.get(speed, 1.0))

    def _spread_virus(self, infected_nodes):
        for node in infected_nodes:
            for connection_id in node.connections:
                if random.random() < Config.SIMULATION_SETTINGS['virus']['spread_rate']:
                    self.infect_node(connection_id)

    def _spread_worm(self, infected_nodes):
        spread_rate = Config.SIMULATION_SETTINGS['worm']['spread_rate']
        num_attempts = int(len(self.nodes) * spread_rate * 0.1)
        for _ in range(num_attempts):
            target = random.randint(0, len(self.nodes) - 1)
            self.infect_node(target)

    def _spread_trojan(self, infected_nodes):
        if random.random() < Config.SIMULATION_SETTINGS['trojan']['spread_rate']:
            uninfected = [n for n in self.nodes.values() if not n.infected]
            if uninfected:
                target = max(uninfected, key=lambda n: n.data_value)
                self.infect_node(target.id)
                self._log_event("Backdoor installed", f"Trojan backdoor on Node {target.id}")

    def _trigger_threat_effects(self, node):
        if self.threat_type == 'virus':
            if random.random() < 0.3:
                self._log_event("Data corruption", f"Files corrupted on Node {node.id}")
        elif self.threat_type == 'worm':
            if len([n for n in self.nodes.values() if n.infected]) > len(self.nodes) * 0.5:
                self._log_event("Network congestion", "High network traffic detected")
        elif self.threat_type == 'trojan':
            if random.random() < 0.2:
                self._log_event("Data exfiltration", f"Sensitive data stolen from Node {node.id}")

    def _update_statistics(self):
        total = self.statistics['total_nodes']
        infected = self.statistics['infected_nodes']
        self.statistics['infection_rate'] = (infected / total) * 100 if total > 0 else 0

        # Simple damage calc if report libs missing
        try:
            damage_rate = Config.SIMULATION_SETTINGS[self.threat_type]['damage_rate']
        except Exception:
            damage_rate = 0.5
        data_loss = self.statistics['data_compromised'] / max(1, self.statistics['total_nodes'])
        self.statistics['damage_assessment'] = min(100, (infected / max(1, total) * 40 + damage_rate * 30 + data_loss * 30) * 100)

    def _log_event(self, event_type, description):
        self.events.append({
            'timestamp': datetime.now().isoformat(),
            'elapsed': self.get_elapsed_time(),
            'type': event_type,
            'description': description
        })

    def get_elapsed_time(self):
        return time.time() - self.start_time if self.start_time else 0

    def get_statistics(self):
        return {
            'simulation_id': self.simulation_id,
            'threat_type': self.threat_type,
            'elapsed_time': self.get_elapsed_time(),
            'statistics': self.statistics,
            'infection_timeline': self.infection_timeline,
            'events': self.events[-50:]
        }

    def get_network_state(self):
        return {
            'nodes': [node.to_dict() for node in self.nodes.values()],
            'connections': self._get_connections_list()
        }

    def _get_connections_list(self):
        connections = []
        for node in self.nodes.values():
            for conn_id in node.connections:
                if node.id < conn_id:
                    connections.append({
                        'source': node.id,
                        'target': conn_id,
                        'infected': node.infected or self.nodes[conn_id].infected
                    })
        return connections

simulator = NetworkSimulator()

# ============================================
# FRONTEND ROUTES (serve index.html and assets)
# ============================================
@app.route('/')
def serve_index():
    # Serves ./public/index.html
    return send_from_directory(app.static_folder, 'index.html')

# Optional: SPA fallback for unknown non-API paths
@app.route('/<path:path>')
def serve_static_or_index(path):
    # If file exists in /public serve it, else serve index.html (SPA)
    full_path = os.path.join(app.static_folder, path)
    if os.path.isfile(full_path):
        return send_from_directory(app.static_folder, path)
    # For unknown paths that are not /api/*, return index for SPA routing
    if not path.startswith('api/'):
        return send_from_directory(app.static_folder, 'index.html')
    abort(404)

# ============================================
# API ROUTES
# ============================================
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'online',
        'message': 'QUANTUM NEXUS API is operational',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/network/create', methods=['POST'])
def create_network():
    data = request.json or {}
    size = int(data.get('size', 50))
    if size > Config.MAX_NODES:
        return jsonify({'error': f'Network size cannot exceed {Config.MAX_NODES} nodes'}), 400
    simulator.create_network(size)
    return jsonify({
        'success': True,
        'message': f'Network created with {size} nodes',
        'network': simulator.get_network_state()
    })

@app.route('/api/simulation/start', methods=['POST'])
def api_start_simulation():
    data = request.json or {}
    threat_type = data.get('threat_type')
    patient_zero = data.get('patient_zero')
    if threat_type not in Config.SIMULATION_SETTINGS:
        return jsonify({'error': 'Invalid threat type'}), 400
    if not simulator.nodes:
        simulator.create_network(50)
    if simulator.start_simulation(threat_type, patient_zero):
        return jsonify({
            'success': True,
            'message': f'{threat_type} simulation started',
            'simulation_id': simulator.simulation_id
        })
    return jsonify({'error': 'Simulation already running'}), 400

@app.route('/api/simulation/stop', methods=['POST'])
def api_stop_simulation():
    stats = simulator.stop_simulation()
    return jsonify({'success': True, 'message': 'Simulation stopped', 'final_statistics': stats})

@app.route('/api/simulation/status', methods=['GET'])
def api_status():
    return jsonify({
        'is_running': simulator.is_running,
        'statistics': simulator.get_statistics(),
        'network_state': simulator.get_network_state()
    })

@app.route('/api/simulation/infect', methods=['POST'])
def api_manual_infect():
    data = request.json or {}
    node_id = data.get('node_id')
    if node_id is None or node_id not in simulator.nodes:
        return jsonify({'error': 'Invalid node ID'}), 400
    success = simulator.infect_node(int(node_id))
    return jsonify({
        'success': success,
        'message': f'Node {node_id} infected' if success else f'Node {node_id} already infected or protected'
    })

@app.route('/api/report/generate', methods=['POST'])
def api_generate_report():
    if not REPORT_FEATURES:
        return jsonify({'error': 'Reporting dependencies not installed'}), 501
    stats = simulator.get_statistics()
    timeline_plot = create_infection_timeline_plot(stats['infection_timeline']) if REPORT_FEATURES else None
    report = {
        'report_id': str(uuid.uuid4()),
        'generated_at': datetime.now().isoformat(),
        'simulation_id': stats['simulation_id'],
        'threat_type': stats['threat_type'],
        'duration': stats['elapsed_time'],
        'summary': {
            'total_nodes': stats['statistics']['total_nodes'],
            'infected_nodes': stats['statistics']['infected_nodes'],
            'infection_rate': f"{stats['statistics']['infection_rate']:.2f}%",
            'damage_assessment': f"{stats['statistics']['damage_assessment']:.2f}%",
            'data_compromised': f"{stats['statistics']['data_compromised']:.2f}"
        },
        'timeline_chart': timeline_plot,
        'events': stats['events']
    }
    return jsonify(report)

@app.route('/api/report/export/pdf', methods=['POST'])
def api_export_pdf():
    if not REPORT_FEATURES:
        return jsonify({'error': 'Reporting dependencies not installed'}), 501
    data = request.json or {}
    report_data = data.get('report_data', {})
    pdf_buffer = create_pdf_report(report_data)
    return send_from_memory(pdf_buffer, filename=f"threat_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf")

# Friendly 404 for unknown API paths
@app.errorhandler(404)
def handle_404(e):
    # If request was for API path, return JSON 404
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Not Found', 'path': request.path}), 404
    # otherwise default (handled by SPA fallback above)
    return jsonify({'error': 'Not Found'}), 404

# ============================================
# REPORT HELPERS (optional)
# ============================================
def create_infection_timeline_plot(timeline):
    if not timeline:
        return None
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(10, 6))
    times = [entry['time'] for entry in timeline]
    infected = [entry['total_infected'] for entry in timeline]
    ax.plot(times, infected, color='#00ffff', linewidth=2, marker='o', markersize=4)
    ax.fill_between(times, infected, alpha=0.3, color='#00ffff')
    ax.set_xlabel('Time (seconds)', color='#00ffff')
    ax.set_ylabel('Infected Nodes', color='#00ffff')
    ax.set_title('Infection Timeline', color='#ff00ff', fontsize=16, fontweight='bold')
    ax.grid(True, alpha=0.3, color='#00ff88')
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', bbox_inches='tight', facecolor='#0a0a0f')
    img_buffer.seek(0)
    img_base64 = base64.b64encode(img_buffer.read()).decode()
    plt.close()
    return f"data:image/png;base64,{img_base64}"

def create_pdf_report(report_data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#00ffff'),
        alignment=1
    )
    story.append(Paragraph("QUANTUM NEXUS - Threat Analysis Report", title_style))
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph(f"Report ID: {report_data.get('report_id', 'N/A')}", styles['Normal']))
    story.append(Paragraph(f"Generated: {report_data.get('generated_at', 'N/A')}", styles['Normal']))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("Executive Summary", styles['Heading2']))
    summary = report_data.get('summary', {})
    summary_data = [
        ['Metric', 'Value'],
        ['Total Nodes', summary.get('total_nodes', 'N/A')],
        ['Infected Nodes', summary.get('infected_nodes', 'N/A')],
        ['Infection Rate', summary.get('infection_rate', 'N/A')],
        ['Damage Assessment', summary.get('damage_assessment', 'N/A')],
        ['Data Compromised', summary.get('data_compromised', 'N/A')],
    ]
    table = Table(summary_data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#00ffff')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0f0f0')),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(table)
    doc.build(story)
    buffer.seek(0)
    return buffer

def send_from_memory(buffer, filename):
    # Helper to send an in-memory file
    return send_from_directory(
        directory=os.getcwd(),
        path=filename
    )

# ============================================
# UTIL: Print available routes on startup
# ============================================
def print_routes():
    print("\nAvailable routes:")
    for rule in app.url_map.iter_rules():
        methods = ','.join(sorted(rule.methods - {'HEAD', 'OPTIONS'}))
        print(f"  {methods:10s} {rule.rule}")
    print("")

# ============================================
# MAIN
# ============================================
if __name__ == '__main__':
    # Prepare initial network
    simulator.create_network(50)

    # Print routes for quick verification
    with app.app_context():
        print_routes()

    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)