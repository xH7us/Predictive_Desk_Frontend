import { format } from 'date-fns';

// Add this function for CSV export
export const exportTicketsToCsv = (tickets) => {
    // Create CSV headers
    const headers = [
        'Name', 'Description', 'Status', 'Priority', 'Urgency', 'Type', 
        'Employee Email', 'Created Date', 'Resolution Time'
    ];

    // Transform tickets to CSV rows
    const rows = tickets.map(ticket => [
        ticket.name.replace(/,/g, ';'),
        ticket.description.replace(/,/g, ';'),
        ticket.status,
        ticket.priority,
        ticket.urgency,
        ticket.type,
        ticket.user_id?.email || 'N/A',
        format(new Date(ticket.date), 'yyyy-MM-dd HH:mm:ss'),
        ticket.actual_resolution_time 
            ? format(new Date(ticket.actual_resolution_time), 'yyyy-MM-dd HH:mm:ss') 
            : 'N/A'
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tickets_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
