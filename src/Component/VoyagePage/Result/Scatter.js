import React, { useState, useEffect } from 'react'
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from 'axios'
import Plot from 'react-plotly.js';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormControlLabel, RadioGroup } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import {scatter_plot_x_vars, scatter_plot_y_vars} from './vars';
import { VoyageContext } from '../VoyageApp';
import {Grid, Paper} from '@mui/material';
import * as options_flat from "../../util/options.json"
import {
    useWindowSize,
  } from '@react-hook/window-size'

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const option_url = '/voyage/?hierarchical=false' // labels in dropdowns

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

function Scatter (props) {
    const [width, height] = useWindowSize()

    const {
        search_object, endpoint
    } = React.useContext(props.context)
    //console.log(search_object)
    const [plot_field, setarrx] = useState([])
    const [plot_value, setarry] = useState([])

    const [option, setOption] = useState({
        field: scatter_plot_x_vars[0],
        value: scatter_plot_y_vars[1]
    })

    const [aggregation, setAgg] = React.useState('sum');
    //const {sum, average} = aggregation;
    // const [label, setLabel] = useState()

    const [isLoading, setLoading] = useState(true);
    const [showAlert, setAlert] = useState(false);
    const [str, setStr] = useState("")

    const handleChange_agg = (event) => {
        setAgg(event.target.value);
    };

    const handleChange = (event, name) => {
        setOption({
            ...option,
            [name]: event.target.value,
        })
    }

    
    useEffect(() => {
        setAlert(false)
        //var group_by = option.field
        var value = option.value
        //var agg = aggregation

        var data = new FormData();
        data.append('hierarchical', 'False');

        //console.log("sb",search_object)
        for(var property in search_object) {
            //console.log("p",property)
            //console.log('so', search_object[property])
            // eslint-disable-next-line no-loop-func
            search_object[property].forEach((v)=>{
                data.append(property, v)
                //console.log("v", v)
            })
        }

        data.append('groupby_fields', option.field)
        data.append('groupby_fields', option.value)
        data.append('agg_fn', aggregation)
        data.append('cachename','voyage_xyscatter')

        axios.post(endpoint+'groupby', data=data)
            .then(function (response) {

                setarrx(Object.keys(response.data[value]))
                setarry(Object.values(response.data[value]))
                setLoading(false)
            })
            .catch(function (error) {
                console.log(error);
                setAlert(true)
            });

    }, [option.field, option.value, aggregation, search_object]);

    // useEffect(() => {
    //         axios.options(option_url)
    //             .then(function (response) {

    //                 setLabel(response.data)
    //                 setLoading(false)
    //             })
    //             .catch(function (error) {
    //                 console.log(error);
    //             })
    //     }, []
    // );

    if (isLoading) {
        return <div className="spinner"></div>;
    }

    const alertBar = () => {
        if(showAlert){
            return <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            <AlertTitle>Sorry, these particular variables don't graph well together:</AlertTitle> 
            <AlertTitle>The {aggregation} of {options_flat[option.field].flatlabel}, {options_flat[option.value].flatlabel} Pie Graph</AlertTitle> 
          </Alert>
        }else{
            return ""
        }
       }

    return (
        <div>
            <div>
                <Box sx={{ maxWidth: width>500 ? width*0.9: width * 0.7}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">X Field</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={option.field}
                            label="X Field"
                            onChange={(event) => {handleChange(event, "field")}}
                            name="field"
                        >
                            {scatter_plot_x_vars.map((option) => {
                                return (
                                <MenuItem key={option} value={option}>
                                    {options_flat[option].flatlabel}
                                </MenuItem>
                            )}
                            )}

                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ maxWidth: width>500 ? width*0.9: width * 0.7, my:2  }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Y Field</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={option.value}
                            name="value"
                            label="Y Field"
                            onChange={(event) => {handleChange(event, "value")}}
                        >
                            {scatter_plot_y_vars.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {options_flat[option].flatlabel}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Box>
            </div>
            <div>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Aggregation Function</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={aggregation}
                        onChange={handleChange_agg}
                        row
                    >
                        <FormControlLabel value="sum" control={<Radio />} label="Sum" />
                        <FormControlLabel value="mean" control={<Radio />} label="Average" />
                    </RadioGroup>
                </FormControl>
                {alertBar()}
            </div>

            <div>
            <Grid>
                <Plot
                    data={[
                        {
                            x: plot_field,
                            y: plot_value,
                            type: 'scatter',
                            mode: 'lines',
                            marker: {color: 'red'},
                            line: {shape: 'spline'},
                        },
                        {type: 'bar'},
                    ]}
                    
                    layout={{width:width*0.8,title: `The ${aggregation} of ${options_flat[option.field].flatlabel} vs <br> ${options_flat[option.value].flatlabel}  Scatter Graph`,
                    xaxis:{
                        title: 
                        {text:`${options_flat[option.field].flatlabel}`},
                        fixedrange: true
                        },
                    yaxis:{
                    title: 
                    {text:`${options_flat[option.value].flatlabel}`},
                    fixedrange: true
                    
                    }}}

                    config={{responsive: true}}
                />
            </Grid>
            </div>
        </div>
    )


}


export default Scatter;