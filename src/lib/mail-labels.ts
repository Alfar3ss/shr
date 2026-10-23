export type MailLabels = Record<string, string>;

const L = (o: string[]): MailLabels =>
  Object.fromEntries(
    ['order', 'code', 'status', 'car', 'pickup', 'return', 'days', 'total', 'payment', 'paymentValue', 'customer', 'name', 'email', 'phone', 'country', 'notes', 'view', 'subject', 'intro', 'confirmed'].map((k, i) => [k, o[i]]),
  );

export const MAIL: Record<string, MailLabels> = {
  en: L(['Order number', 'Confirmation code', 'Status', 'Car', 'Pickup', 'Return', 'Days', 'Total', 'Payment', 'Payment at the agency', 'Customer', 'Name', 'Email', 'Phone', 'Country', 'Notes', 'View booking', 'Your booking', 'Thank you for booking with SHR Cars Rental. Here are your details.', 'Confirmed']),
  fr: L(['Numéro de commande', 'Code de confirmation', 'Statut', 'Voiture', 'Retrait', 'Restitution', 'Jours', 'Total', 'Paiement', "Paiement à l'agence", 'Client', 'Nom', 'E-mail', 'Téléphone', 'Pays', 'Notes', 'Voir la réservation', 'Votre réservation', 'Merci d\'avoir réservé chez SHR Cars Rental. Voici vos informations.', 'Confirmée']),
  es: L(['Número de pedido', 'Código de confirmación', 'Estado', 'Coche', 'Recogida', 'Devolución', 'Días', 'Total', 'Pago', 'Pago en la agencia', 'Cliente', 'Nombre', 'Correo', 'Teléfono', 'País', 'Notas', 'Ver reserva', 'Tu reserva', 'Gracias por reservar con SHR Cars Rental. Estos son tus datos.', 'Confirmada']),
  de: L(['Bestellnummer', 'Bestätigungscode', 'Status', 'Auto', 'Abholung', 'Rückgabe', 'Tage', 'Gesamt', 'Zahlung', 'Zahlung in der Agentur', 'Kunde', 'Name', 'E-Mail', 'Telefon', 'Land', 'Hinweise', 'Buchung ansehen', 'Ihre Buchung', 'Vielen Dank für Ihre Buchung bei SHR Cars Rental. Hier sind Ihre Daten.', 'Bestätigt']),
  nl: L(['Ordernummer', 'Bevestigingscode', 'Status', 'Auto', 'Ophalen', 'Inleveren', 'Dagen', 'Totaal', 'Betaling', 'Betaling bij het kantoor', 'Klant', 'Naam', 'E-mail', 'Telefoon', 'Land', 'Opmerkingen', 'Boeking bekijken', 'Uw boeking', 'Bedankt voor uw boeking bij SHR Cars Rental. Hier zijn uw gegevens.', 'Bevestigd']),
  it: L(['Numero d\'ordine', 'Codice di conferma', 'Stato', 'Auto', 'Ritiro', 'Riconsegna', 'Giorni', 'Totale', 'Pagamento', 'Pagamento in agenzia', 'Cliente', 'Nome', 'E-mail', 'Telefono', 'Paese', 'Note', 'Vedi prenotazione', 'La tua prenotazione', 'Grazie per aver prenotato con SHR Cars Rental. Ecco i tuoi dati.', 'Confermata']),
};
