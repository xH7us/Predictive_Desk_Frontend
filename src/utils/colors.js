export const colors = {
    redHeader: '#dbbcb2',
    green: '#bcdbb2',
    blue: '#b2d3db',
    statusColors: {
        pending: '#efbdc2',
        active: '#b2d3db',
        resolved: '#c5e9b9',
    },
    chartColors: {
        pending: '#f05d5d',
        active: '#1890ff',
        resolved: '#5da656',
    },
    buttonColor: {
        primary: 'linear-gradient(to right, rgb(0, 0, 0), rgb(101 130 199))'
    },
    chartNewColor: {
        base: '#36454F'
    }
};

export const getPriorityColor = (priority) => {
    switch (priority) {
        case 'High': return 'red';
        case 'Medium': return 'orange';
        case 'Low': return 'green';
        default: return 'blue';
    }
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return '#faad14';
        case 'active': return '#1890ff';
        case 'resolved': return '#52c41a';
        default: return '#d9d9d9';
    }
};
