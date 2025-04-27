from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/send": {"origins": "*"}})

# Konfiguracja SMTP
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SMTP_LOGIN = 'gabinet323@gmail.com'     # techniczny e-mail
SMTP_PASSWORD = 'gppr nduo gqbo jthy'           # np. hasło aplikacji Gmail

# E-mail, na który ma trafić formularz
RECIPIENT = 'pietracha10@wp.pl'

@app.route('/send', methods=['POST'])
def send_form():
    data = request.form

    # Tworzymy wiadomość do firmy
    firm_msg = MIMEMultipart()
    firm_msg['From'] = SMTP_LOGIN
    firm_msg['To'] = RECIPIENT
    firm_msg['Subject'] = f"Nowe zapytanie od {data['firstName']} {data['lastName']}"

    firm_content = f"""
    **Dane klienta:**
    Imię i nazwisko: {data['firstName']} {data['lastName']}
    Email: {data['email']}
    Telefon: {data['phone']}

    **Szczegóły zapytania:**
    Liczba gości: {data['guestCount']}
    Kolorystyka: {data.get('colorScheme', 'Brak')}
    Lokalizacja: {data['venueInfo']}
    Zakres dekoracji: {', '.join(request.form.getlist('decorationScope[]'))}

    **Wiadomość:**
    Wiadomość: {data.get('message', 'Brak')}
    """
    firm_msg.attach(MIMEText(firm_content, 'plain'))

    # Tworzymy potwierdzenie do klienta
    client_msg = MIMEMultipart()
    client_msg['From'] = SMTP_LOGIN
    client_msg['To'] = data['email']
    client_msg['Subject'] = "Dziękujemy za zapytanie – Ślubne Dylematy"

    client_content = f"""
    Szanowny Panie/Pani {data['firstName']},

    Dziękujemy za przesłanie formularza. Potwierdzamy, że Państwa wiadomość została pomyślnie zarejestrowana w naszym systemie.
    Niniejsze potwierdzenie zostało wygenerowane automatycznie. Nasz zespół dokłada wszelkich starań, aby po dokładnym przeanalizowaniu Państwa oferty, jak najszybciej udzielić  odpowiedzi.
    W przypadku pilnych spraw prosimy o kontakt telefoniczny pod numerem [numer telefonu].

    Z poważaniem,
    Zespół Ślubne Dylematy


    """
    client_msg.attach(MIMEText(client_content, 'plain'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_LOGIN, SMTP_PASSWORD)
        server.send_message(firm_msg)
        server.send_message(client_msg)
        server.quit()

        return jsonify({"success": True, "message": "Wiadomości wysłane!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)