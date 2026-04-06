<?php
// admin.php - Tableau de bord pour voir les messages
require_once 'config.php';

$pdo = getDBConnection();

if (!$pdo) {
    die("❌ Erreur de connexion à la base de données");
}

// Compter les enregistrements
$totalContacts = $pdo->query("SELECT COUNT(*) FROM contacts")->fetchColumn();
$totalNewsletter = $pdo->query("SELECT COUNT(*) FROM newsletter")->fetchColumn();
$todayContacts = $pdo->query("SELECT COUNT(*) FROM contacts WHERE DATE(created_at) = CURDATE()")->fetchColumn();

// Récupérer les messages
$contacts = $pdo->query("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 50")->fetchAll();
$newsletters = $pdo->query("SELECT * FROM newsletter ORDER BY created_at DESC LIMIT 50")->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Administration - Dar El Founoun</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f8fafc; padding: 2rem; }
        .container { max-width: 1400px; margin: 0 auto; }
        h1 { color: #1a2a3a; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; justify-content: space-between; flex-wrap: wrap; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 16px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .stat-card i { font-size: 2rem; color: #e67e22; margin-bottom: 0.5rem; }
        .stat-number { font-size: 2rem; font-weight: 800; color: #1e293b; }
        .stat-label { color: #64748b; }
        .tabs { display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid #e2e8f0; }
        .tab-btn { padding: 0.75rem 1.5rem; background: none; border: none; font-size: 1rem; font-weight: 600; cursor: pointer; color: #64748b; }
        .tab-btn.active { color: #e67e22; border-bottom: 2px solid #e67e22; margin-bottom: -2px; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .table-container { background: white; border-radius: 16px; overflow-x: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        table { width: 100%; border-collapse: collapse; min-width: 700px; }
        th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #1a2a3a; color: white; }
        tr:hover { background: #f8fafc; }
        .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; }
        .badge-success { background: #dcfce7; color: #166534; }
        .badge-warning { background: #fed7aa; color: #9a3412; }
        .back-link { display: inline-block; margin-top: 2rem; color: #e67e22; text-decoration: none; }
        .btn-refresh { background: #e67e22; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
        @media (max-width: 768px) { body { padding: 1rem; } th, td { padding: 0.5rem; font-size: 0.8rem; } }
    </style>
</head>
<body>
    <div class="container">
        <h1>
            <span><i class="fas fa-database"></i> Base de données - Dar El Founoun</span>
            <button class="btn-refresh" onclick="location.reload()"><i class="fas fa-sync-alt"></i> Actualiser</button>
        </h1>
        
        <div class="stats">
            <div class="stat-card">
                <i class="fas fa-envelope"></i>
                <div class="stat-number"><?= $totalContacts ?></div>
                <div class="stat-label">Messages reçus</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <div class="stat-number"><?= $totalNewsletter ?></div>
                <div class="stat-label">Abonnés newsletter</div>
            </div>
            <div class="stat-card">
                <i class="fas fa-calendar-day"></i>
                <div class="stat-number"><?= $todayContacts ?></div>
                <div class="stat-label">Messages aujourd'hui</div>
            </div>
        </div>
        
        <div class="tabs">
            <button class="tab-btn active" data-tab="contacts"><i class="fas fa-envelope"></i> Messages (<?= $totalContacts ?>)</button>
            <button class="tab-btn" data-tab="newsletter"><i class="fas fa-users"></i> Newsletter (<?= $totalNewsletter ?>)</button>
        </div>
        
        <!-- Messages de contact -->
        <div id="contacts-tab" class="tab-content active">
            <div class="table-container">
                <table>
                    <thead>
                        <tr><th>ID</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Sujet</th><th>Message</th><th>Date</th><th>Formspree</th></tr>
                    </thead>
                    <tbody>
                        <?php if (count($contacts) > 0): ?>
                            <?php foreach ($contacts as $c): ?>
                            <tr>
                                <td><?= $c['id'] ?></td>
                                <td><strong><?= htmlspecialchars($c['name']) ?></strong></td>
                                <td><?= htmlspecialchars($c['email']) ?></td>
                                <td><?= htmlspecialchars($c['phone'] ?: '-') ?></td>
                                <td><?= htmlspecialchars($c['subject'] ?: '-') ?></td>
                                <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="<?= htmlspecialchars($c['message']) ?>">
                                    <?= htmlspecialchars(mb_substr($c['message'], 0, 50)) ?>...
                                </td>
                                <td><?= date('d/m/Y H:i', strtotime($c['created_at'])) ?></td>
                                <td>
                                    <?php if ($c['formspree_sent']): ?>
                                        <span class="badge badge-success"><i class="fas fa-check"></i> Envoyé</span>
                                    <?php else: ?>
                                        <span class="badge badge-warning"><i class="fas fa-clock"></i> En attente</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr><td colspan="8" style="text-align: center; padding: 3rem;">Aucun message pour le moment</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Newsletter -->
        <div id="newsletter-tab" class="tab-content">
            <div class="table-container">
                <table>
                    <thead><tr><th>ID</th><th>Email</th><th>IP</th><th>Date</th><th>Formspree</th></tr></thead>
                    <tbody>
                        <?php if (count($newsletters) > 0): ?>
                            <?php foreach ($newsletters as $n): ?>
                            <tr>
                                <td><?= $n['id'] ?></td>
                                <td><strong><?= htmlspecialchars($n['email']) ?></strong></td>
                                <td><?= htmlspecialchars($n['ip_address'] ?: '-') ?></td>
                                <td><?= date('d/m/Y H:i', strtotime($n['created_at'])) ?></td>
                                <td>
                                    <?php if ($n['formspree_sent']): ?>
                                        <span class="badge badge-success">✅ Envoyé</span>
                                    <?php else: ?>
                                        <span class="badge badge-warning">⏳ En attente</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr><td colspan="5" style="text-align: center; padding: 3rem;">Aucun abonné newsletter</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding: 1rem; background: #e3f2fd; border-radius: 12px;">
            <h4><i class="fas fa-info-circle"></i> Informations :</h4>
            <ul style="margin-left: 1.5rem;">
                <li>✅ Messages avec badge "Envoyé" = bien transmis à Formspree</li>
                <li>⚠️ Messages avec badge "En attente" = uniquement en base (problème d'envoi email)</li>
                <li>📧 Formspree : <a href="https://formspree.io/login" target="_blank">https://formspree.io/login</a></li>
                <li>🗄️ phpMyAdmin : <a href="http://localhost/phpmyadmin" target="_blank">http://localhost/phpmyadmin</a></li>
            </ul>
        </div>
        
        <a href="index.html" class="back-link"><i class="fas fa-arrow-left"></i> Retour au site</a>
    </div>
    
    <script>
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
            });
        });
    </script>
</body>
</html>
http://localhost/dar_elfounoun/admin.php