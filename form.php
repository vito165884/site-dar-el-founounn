<?php
// $mail_sent = mail($to, $email_subject, $email_body, $headers);
$mail_sent = true; // Simuler l'envoi
// Configuration de l'envoi d'email
$to = "contact@darelfounoun.tn"; // Remplacez par votre email
$site_name = "Dar El Founoun";

// Récupérer les données du formulaire
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = "Le nom est requis";
} elseif (strlen($name) < 2) {
    $errors[] = "Le nom doit contenir au moins 2 caractères";
}

if (empty($email)) {
    $errors[] = "L'email est requis";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Email invalide";
}

if (empty($subject)) {
    $errors[] = "Le sujet est requis";
}

if (empty($message)) {
    $errors[] = "Le message est requis";
} elseif (strlen($message) < 10) {
    $errors[] = "Le message doit contenir au moins 10 caractères";
}

// S'il y a des erreurs, les retourner
if (!empty($errors)) {
    echo "<!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Erreur - Dar El Founoun</title>
        <style>
            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #1a2a3a, #0f1a24);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                padding: 20px;
            }
            .error-box {
                background: white;
                border-radius: 24px;
                padding: 2rem;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            }
            .error-box i {
                font-size: 4rem;
                color: #ef4444;
                margin-bottom: 1rem;
            }
            .error-box h2 {
                color: #1e293b;
                margin-bottom: 1rem;
            }
            .error-box ul {
                text-align: left;
                margin: 1rem 0;
                color: #64748b;
            }
            .error-box a {
                display: inline-block;
                margin-top: 1rem;
                padding: 0.75rem 1.5rem;
                background: linear-gradient(135deg, #e67e22, #f39c12);
                color: white;
                text-decoration: none;
                border-radius: 50px;
                transition: 0.3s;
            }
            .error-box a:hover {
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class='error-box'>
            <i class='fas fa-exclamation-circle'></i>
            <h2>Erreur dans le formulaire</h2>
            <ul>";
    foreach ($errors as $error) {
        echo "<li>❌ $error</li>";
    }
    echo "      </ul>
            <a href='javascript:history.back()'>← Retour au formulaire</a>
        </div>
    </body>
    </html>";
    exit;
}

// Sujet de l'email
$email_subject = "Nouveau message de $name - $site_name";

// Corps de l'email
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e67e22, #f39c12); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #e67e22; }
        .value { margin-top: 5px; background: white; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>📬 Nouveau message de contact</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>👤 Nom complet</div>
                <div class='value'>" . htmlspecialchars($name) . "</div>
            </div>
            <div class='field'>
                <div class='label'>📧 Email</div>
                <div class='value'>" . htmlspecialchars($email) . "</div>
            </div>
            <div class='field'>
                <div class='label'>📞 Téléphone</div>
                <div class='value'>" . (!empty($phone) ? htmlspecialchars($phone) : 'Non renseigné') . "</div>
            </div>
            <div class='field'>
                <div class='label'>📌 Sujet</div>
                <div class='value'>" . htmlspecialchars($subject) . "</div>
            </div>
            <div class='field'>
                <div class='label'>💬 Message</div>
                <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Message envoyé depuis le site Dar El Founoun</p>
            <p>Date: " . date('d/m/Y H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Headers pour l'email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: $site_name <noreply@" . $_SERVER['HTTP_HOST'] . ">\r\n";
$headers .= "Reply-To: $email\r\n";

// Envoyer l'email
$mail_sent = mail($to, $email_subject, $email_body, $headers);

// Page de confirmation
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Message envoyé - Dar El Founoun</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #1a2a3a, #0f1a24);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
        }
        .success-box {
            background: white;
            border-radius: 24px;
            padding: 2.5rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            animation: fadeInUp 0.6s ease;
        }
        .success-box i {
            font-size: 5rem;
            color: #22c55e;
            margin-bottom: 1rem;
        }
        .success-box h2 {
            color: #1e293b;
            margin-bottom: 1rem;
            font-size: 1.8rem;
        }
        .success-box p {
            color: #64748b;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        .success-box a {
            display: inline-block;
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #e67e22, #f39c12);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            transition: 0.3s;
            font-weight: 600;
        }
        .success-box a:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(230,126,34,0.3);
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="success-box">
        <i class="fas fa-check-circle"></i>
        <h2>Message envoyé !</h2>
        <p>Merci <strong><?php echo htmlspecialchars($name); ?></strong> pour votre message.<br>
        Notre équipe vous répondra dans les plus brefs délais.</p>
        <a href="index.html">← Retour à l'accueil</a>
    </div>
</body>
</html>