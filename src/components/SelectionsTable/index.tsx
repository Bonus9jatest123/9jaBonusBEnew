import React from 'react';
import { FormData } from '../FormContainer';

interface SelectionsTableProps {
  handleChange: (e: React.ChangeEvent<any>) => void;
  values: FormData;
}

const SelectionsTable = ({ handleChange, values }: SelectionsTableProps) => {
  return (
    <table className="bonus-table">
      <tr>
        <th>Selections</th>
        <th>%</th>
        <th>Selections</th>
        <th>%</th>
        <th>Selections</th>
        <th>%</th>
        <th>Selections</th>
        <th>%</th>
      </tr>
      <tr>
        <td>1</td>
        <td>
          <input type="number" min={0} name="selections.1" value={values.selections['1']!} onChange={handleChange} />
        </td>
        <td>11</td>
        <td>
          <input type="number" min={0} name="selections.11" value={values.selections['11']!} onChange={handleChange} />
        </td>
        <td>21</td>
        <td>
          <input type="number" min={0} name="selections.21" value={values.selections['21']!} onChange={handleChange} />
        </td>
        <td>31</td>
        <td>
          <input type="number" min={0} name="selections.31" value={values.selections['31']!} onChange={handleChange} />
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td>
          <input type="number" min={0} name="selections.2" value={values.selections['2']!} onChange={handleChange} />
        </td>
        <td>12</td>
        <td>
          <input type="number" min={0} name="selections.12" value={values.selections['12']!} onChange={handleChange} />
        </td>
        <td>22</td>
        <td>
          <input type="number" min={0} name="selections.22" value={values.selections['22']!} onChange={handleChange} />
        </td>
        <td>32</td>
        <td>
          <input type="number" min={0} name="selections.32" value={values.selections['32']!} onChange={handleChange} />
        </td>
      </tr>
      <tr>
        <td>3</td>
        <td>
          <input type="number" min={0} name="selections.3" value={values.selections['3']!} onChange={handleChange} />
        </td>
        <td>13</td>
        <td>
          <input type="number" min={0} name="selections.13" value={values.selections['13']!} onChange={handleChange} />
        </td>
        <td>23</td>
        <td>
          <input type="number" min={0} name="selections.23" value={values.selections['23']!} onChange={handleChange} />
        </td>
        <td>33</td>
        <td>
          <input type="number" min={0} name="selections.33" value={values.selections['33']!} onChange={handleChange} />
        </td>
      </tr>
      <tr>
        <td>4</td>
        <td>
          <input type="number" min={0} name="selections.4" value={values.selections['4']!} onChange={handleChange} />
        </td>
        <td>14</td>
        <td>
          <input type="number" min={0} name="selections.14" value={values.selections['14']!} onChange={handleChange} />
        </td>
        <td>24</td>
        <td>
          <input type="number" min={0} name="selections.24" value={values.selections['24']!} onChange={handleChange} />
        </td>
        <td>34</td>
        <td>
          <input type="number" min={0} name="selections.34" value={values.selections['34']!} onChange={handleChange} />
        </td>
      </tr>
      <tr>
        <td>5</td>
        <td>
          <input type="number" min={0} name="selections.5" value={values.selections['5']!} onChange={handleChange} />
        </td>
        <td>15</td>
        <td>
          <input type="number" min={0} name="selections.15" value={values.selections['15']!} onChange={handleChange} />
        </td>
        <td>25</td>
        <td>
          <input type="number" min={0} name="selections.25" value={values.selections['25']!} onChange={handleChange} />
        </td>
        <td>35</td>
        <td>
          <input type="number" min={0} name="selections.35" value={values.selections['35']!} onChange={handleChange} />
        </td>
      </tr>
      <tr>
        <td>6</td>
        <td>
          <input type="number" min={0} name="selections.6" value={values.selections['6']!} onChange={handleChange} />
        </td>
        <td>16</td>
        <td>
          <input type="number" min={0} name="selections.16" value={values.selections['16']!} onChange={handleChange} />
        </td>
        <td>26</td>
        <td>
          <input type="number" min={0} name="selections.26" value={values.selections['26']!} onChange={handleChange} />
        </td>
        <td>36</td>
        <td>
          <input type="number" min={0} name="selections.36" value={values.selections['36']!} onChange={handleChange} />
        </td>
      </tr>
      <tr>
        <td>7</td>
        <td>
          <input type="number" min={0} name="selections.7" value={values.selections['7']!} onChange={handleChange} />
        </td>
        <td>17</td>
        <td>
          <input type="number" min={0} name="selections.17" value={values.selections['17']!} onChange={handleChange} />
        </td>
        <td>27</td>
        <td>
          <input type="number" min={0} name="selections.27" value={values.selections['27']!} onChange={handleChange} />
        </td>
        <td>37</td>
        <td>
          <input type="number" min={0} name="selections.37" value={values.selections['37']!} onChange={handleChange} />
        </td>
      </tr>
      <tr>
        <td>8</td>
        <td>
          <input type="number" min={0} name="selections.8" value={values.selections['8']!} onChange={handleChange} />
        </td>
        <td>18</td>
        <td>
          <input type="number" min={0} name="selections.18" value={values.selections['18']!} onChange={handleChange} />
        </td>
        <td>28</td>
        <td>
          <input type="number" min={0} name="selections.28" value={values.selections['28']!} onChange={handleChange} />
        </td>
        <td>38</td>
        <td>
          <input type="number" min={0} name="selections.38" value={values.selections['38']!} onChange={handleChange} />
        </td>
      </tr>
      <tr>
        <td>9</td>
        <td>
          <input type="number" min={0} name="selections.9" value={values.selections['9']!} onChange={handleChange} />
        </td>
        <td>19</td>
        <td>
          <input type="number" min={0} name="selections.19" value={values.selections['19']!} onChange={handleChange} />
        </td>
        <td>29</td>
        <td>
          <input type="number" min={0} name="selections.29" value={values.selections['29']!} onChange={handleChange} />
        </td>
        <td>39</td>
        <td>
          <input type="number" min={0} name="selections.39" value={values.selections['39']!} onChange={handleChange} />
        </td>
      </tr>
      <tr>
        <td>10</td>
        <td>
          <input type="number" min={0} name="selections.10" value={values.selections['10']!} onChange={handleChange} />
        </td>
        <td>20</td>
        <td>
          <input type="number" min={0} name="selections.20" value={values.selections['20']!} onChange={handleChange} />
        </td>
        <td>30</td>
        <td>
          <input type="number" min={0} name="selections.30" value={values.selections['30']!} onChange={handleChange} />
        </td>
        <td>40</td>
        <td>
          <input type="number" min={0} name="selections.40" value={values.selections['40']!} onChange={handleChange} />
        </td>
      </tr>
    </table>
  );
};

export default SelectionsTable;
