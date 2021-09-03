import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';

const columns = [{
    dataField: 'classNumber',
    text: 'Class Number',
    headerStyle: (colum, colIndex) => {
        return { width: '70px' };
    }
}, {
    dataField: 'course',
    text: 'Course Code',
    headerStyle: (colum, colIndex) => {
        return { width: '80px' };
    }
}, {
    dataField: 'classTitle',
    text: 'Course Title',
    headerStyle: (colum, colIndex) => {
        return { width: '260px' };
    }
}, {
    dataField: 'instructor',
    text: 'Instructor Name',
    headerStyle: (colum, colIndex) => {
        return { width: '130px' };
    }
}, {
    dataField: 'session',
    text: 'Session',
    headerStyle: (colum, colIndex) => {
        return { width: '70px' };
    }
}];

const CoursesTable = ({ coursesData, handleSelectRow }) => {
    return <BootstrapTable
        keyField='classNumber'
        data={coursesData}
        columns={columns}
        selectRow={handleSelectRow}
        wrapperClasses="table-responsive table-wrapper"
        classes="main-table-class"
        hover condensed bootstrap4 />;
}

export default CoursesTable;