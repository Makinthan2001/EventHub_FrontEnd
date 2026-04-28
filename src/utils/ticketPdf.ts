import jsPDF from 'jspdf';

interface TicketData {
  transactionId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
}

export const generateTicketPDF = (ticketData: TicketData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Set background color
  doc.setFillColor(249, 250, 251);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header with gradient effect (simulated with rectangles)
  doc.setFillColor(79, 70, 229); // Indigo-600
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('EVENT TICKET', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('EventHub Platform', pageWidth / 2, 30, { align: 'center' });

  // Transaction ID Box
  doc.setFillColor(236, 254, 255);
  doc.setDrawColor(34, 211, 238);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 50, pageWidth - 30, 15, 3, 3, 'FD');
  doc.setTextColor(6, 95, 70);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction ID:', 20, 58);
  doc.setFont('helvetica', 'normal');
  doc.text(ticketData.transactionId, 60, 58);

  // Event Details Section
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Event Details', 20, 80);

  // Event Info Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 85, pageWidth - 30, 50, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105); // slate-600
  
  // Event Name
  doc.text('Event:', 20, 95);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(ticketData.eventTitle, 45, 95, { maxWidth: pageWidth - 70 });

  // Date & Time
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Date:', 20, 105);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(ticketData.eventDate, 45, 105);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Time:', 20, 115);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(ticketData.eventTime, 45, 115);

  // Location
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Location:', 20, 125);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(ticketData.eventLocation, 45, 125, { maxWidth: pageWidth - 70 });

  // Attendee Details Section
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Attendee Information', 20, 150);

  // Attendee Info Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 155, pageWidth - 30, 30, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  
  doc.text('Name:', 20, 165);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(ticketData.attendeeName, 45, 165);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Email:', 20, 175);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(ticketData.attendeeEmail, 45, 175);

  // Ticket Details Section
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Ticket Details', 20, 200);

  // Ticket Info Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 205, pageWidth - 30, 30, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  
  doc.text('Ticket Type:', 20, 215);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(ticketData.ticketType, 50, 215);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Quantity:', 20, 225);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(ticketData.quantity.toString(), 50, 225);

  // Total Amount Box (highlighted)
  doc.setFillColor(238, 242, 255); // Indigo-50
  doc.setDrawColor(79, 70, 229); // Indigo-600
  doc.setLineWidth(1);
  doc.roundedRect(15, 245, pageWidth - 30, 20, 3, 3, 'FD');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text('Total Amount:', 20, 257);
  doc.setFontSize(16);
  doc.text(
    ticketData.totalAmount === 0 
      ? 'FREE' 
      : `LKR ${ticketData.totalAmount.toLocaleString()}`,
    pageWidth - 20,
    257,
    { align: 'right' }
  );

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Please present this ticket at the event entrance.', pageWidth / 2, pageHeight - 20, {
    align: 'center',
  });
  doc.text('For inquiries, contact: support@eventhub.com', pageWidth / 2, pageHeight - 13, {
    align: 'center',
  });

  // Barcode placeholder (simple line representation)
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.3);
  const barcodeY = pageHeight - 35;
  const barcodeWidth = 60;
  const barcodeStart = (pageWidth - barcodeWidth) / 2;
  
  for (let i = 0; i < 30; i++) {
    const lineHeight = Math.random() > 0.5 ? 8 : 10;
    doc.line(barcodeStart + i * 2, barcodeY, barcodeStart + i * 2, barcodeY + lineHeight);
  }

  // Download the PDF
  const fileName = `Ticket_${ticketData.transactionId}_${Date.now()}.pdf`;
  doc.save(fileName);
};
