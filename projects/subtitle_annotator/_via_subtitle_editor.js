/**
 * @class
 * @classdesc Subtitle editor for video and audio
 * @author Abhishek Dutta <adutta@robots.ox.ac.uk>
 * @since 21 Sep. 2020
 */
function _via_subtitle_editor(groupby_aid, data, temporal_segmenter, container, data_RH=null, data_LH=null) {
  this._ID = '_via_subtitle_editor';
  this.groupby_aid = groupby_aid;
  this.d  = data;
  this.d_RH  = data_RH;
  this.d_LH  = data_LH;
  this.ts = temporal_segmenter;
  this.c  = container;

  // state
  this.mid_list = [];
  this.subtitle_track_cue_list = [];
  this.selected_mindex = -1;

  // initialise event listeners
  this.ts.on_event('metadata_add', this._ID, this.on_event_metadata_add.bind(this));
  this.ts.on_event('metadata_delete', this._ID, this.on_event_metadata_del.bind(this));
  this.ts.on_event('metadata_select', this._ID, this._on_event_metadata_select.bind(this));
  this.ts.on_event('metadata_unselect', this._ID, this._on_event_metadata_unselect.bind(this));
  this.ts.on_event('metadata_update', this._ID, this._on_event_metadata_update.bind(this));

  this.init();
}

_via_subtitle_editor.prototype.init = function() {
  for (ix in [...Array(this.ts.m.textTracks.length).keys()]){
    this.ts.m.textTracks[ix].mode = 'disabled'
  }
  var subtitle_track = this.ts.m.addTextTrack('subtitles', 'English', 'en');
  subtitle_track.mode = 'showing';

  this.c.setAttribute('style', 'height:' + this.c.clientHeight + 'px');
  this.c.innerHTML = '';
  this.subtitle_table = document.createElement('table');

  var subtitle_head = document.createElement('thead');
  subtitle_head.innerHTML = '<tr><th>Start</td><th>End</th><th>Subtitle Text</th></tr>';

  this.subtitle_tbody = document.createElement('tbody');
  this.mid_list = Object.keys(this.d.store.metadata);
  this.mid_list.sort( this._compare_mid_by_time.bind(this) );
  var row_index = 1;


  for(var mindex in this.mid_list) {
    // debugger
    var mid = this.mid_list[mindex];
    this.tmp_mid = mid;
    var index = document.createElement('td');
    index.innerHTML = row_index;
    var row = document.createElement('tr');
    row.setAttribute('id', 'subtitle_mindex_' + mindex);
    row.addEventListener('click', this.on_click_row.bind(this, parseInt(mindex)));

    var stime = document.createElement('td');
    var start = _via_seconds_to_hh_mm_ss_ms(this.d.store.metadata[mid]['z'][0]);
    stime.innerHTML = '<span class="hhmmss">' + start[0] + ':' + start[1] + ':' + start[2] + '</span><span class="ms">' + start[3] + '</span>';
    var etime = document.createElement('td');
    var end = _via_seconds_to_hh_mm_ss_ms(this.d.store.metadata[mid]['z'][1]);
    etime.innerHTML = '<span class="hhmmss">' + end[0] + ':' + end[1] + ':' + end[2] + '</span><span class="ms">' + end[3] + '</span>';


    var subtitle = document.createElement('td');
    subtitle.setAttribute('id', 'subtitle');

    // show selected 
    var selected_gloss = document.createElement('td')
    selected_gloss.setAttribute('id', 'selected_gloss_' + mid);
    selected_gloss.setAttribute('width', '200px')
    selected_gloss.innerText = this.d.store.metadata[mid]['av'][this.groupby_aid];
    // selected_gloss.setAttribute('text', 'test')
    // selected_gloss.setAttribute('value', 'test')

    // editable dropdown
    var input = document.createElement('input');
    input.setAttribute('id', 'input_' + mid);
    input.setAttribute('list', 'browsers'+mindex);
    input.setAttribute('name', 'browser');
    input.setAttribute('type', 'text');
    input.setAttribute('data-mid', mid);

    input.addEventListener('click', this.onclick_subtitle_text.bind(this));
    input.addEventListener('change', this.onchange_subtitle_text.bind(this));
    var datalist = document.createElement('datalist');
    datalist.setAttribute('id', 'browsers'+mindex);

    // Top-5 Dropdown here
    // 
    // var select = document.createElement('select');
    // select.setAttribute('data-mid', mid);
    // select.addEventListener('click', this.onclick_subtitle_text.bind(this));
    // select.addEventListener('change', this.onchange_subtitle_text.bind(this));

    // var list_test = this.d.store.metadata[mid]['av'][this.groupby_aid];
    // var values_test = list_test.split(',');
    // for(var ix in values_test) { 
    //   var opt1 = document.createElement('option')
    //   opt1.setAttribute('value', values_test[ix]);  
    //   opt1.text = values_test[ix]
    //   select.appendChild(opt1);
    //   // datalist.appendChild(opt1);
    // }
    

    // Top-5
    if ('top5' in this.d.store.metadata[mid]){
      var top5_list = this.d.store.metadata[mid]['top5']["0"];
      var values_test = top5_list.split(',');
      for(var ix in values_test) { 
        var opt2 = document.createElement('option')
        opt2.setAttribute('value', values_test[ix]);  
        opt2.text = values_test[ix]
        datalist.appendChild(opt2);
      }
    }

    // All classes
    var class_list = this.d.classes
    for(var ix in class_list) {
      var opt2 = document.createElement('option')
      opt2.setAttribute('value', class_list[ix]);  
      opt2.text = class_list[ix]
      datalist.appendChild(opt2);
    }
    // subtitle.appendChild(select);
    input.appendChild(datalist)
    subtitle.appendChild(input);


    var RH_label = document.createElement('label');
    var checkbox_RH = document.createElement('input')
    checkbox_RH.setAttribute('type', 'checkbox');
    checkbox_RH.setAttribute('id', 'RH');
    checkbox_RH.setAttribute('value', 'RH');
    checkbox_RH.setAttribute('data-mid', mid);

    if (mid in this.d_RH.store.metadata){
      if ('checkbox' in this.d_RH.store.metadata[mid]){
        if (this.d_RH.store.metadata[mid].checkbox == true){
          checkbox_RH.setAttribute('checked', true);
        }
      }
    }
    checkbox_RH.addEventListener('click', this.onclick_subtitle_text.bind(this));
    checkbox_RH.addEventListener('change', this.onchange_checkbox_RH.bind(this));
    RH_label.innerHTML = 'RH';
    RH_label.appendChild(checkbox_RH)


    var LH_label = document.createElement('label');
    var checkbox_LH = document.createElement('input')
    checkbox_LH.setAttribute('type', 'checkbox');
    checkbox_LH.setAttribute('id', 'LH');
    checkbox_LH.setAttribute('value', 'LH');
    checkbox_LH.setAttribute('data-mid', mid);
    if ('checkbox_init' in this.d.store.metadata[mid]){
      if (mid in this.d_LH.store.metadata){
        if ('checkbox' in this.d_LH.store.metadata[mid]){
          if (this.d_LH.store.metadata[mid].checkbox == true){
            checkbox_LH.setAttribute('checked', true);
          }
        }
      }
    } else {
      this.init_checkbox_LH(mid)
      this.init_checkbox_RH(mid)
      checkbox_RH.setAttribute('checked', true);
      checkbox_LH.setAttribute('checked', true);
      this.d.store.metadata[mid]['checkbox_init'] = true;
    }

    checkbox_LH.addEventListener('click', this.onclick_subtitle_text.bind(this));
    checkbox_LH.addEventListener('change', this.onchange_checkbox_LH.bind(this));
    LH_label.innerHTML = 'LH';
    LH_label.appendChild(checkbox_LH)

    row.appendChild(index);
    row.appendChild(stime);
    row.appendChild(etime);
    row.appendChild(selected_gloss);
    row.appendChild(subtitle);
    row.appendChild(RH_label);
    row.appendChild(LH_label);
    this.subtitle_tbody.appendChild(row);
    row_index = row_index + 1;

    this.subtitle_track_cue_list[mindex] = new VTTCue(this.d.store.metadata[mid]['z'][0],
                                                      this.d.store.metadata[mid]['z'][1],
                                                      this.d.store.metadata[mid]['av'][this.groupby_aid]);

    subtitle_track.addCue(this.subtitle_track_cue_list[mindex]);
  }

  //this.subtitle_table.appendChild(subtitle_head);
  this.subtitle_table.appendChild(this.subtitle_tbody);
  this.c.appendChild(this.subtitle_table);
}

_via_subtitle_editor.prototype.onclick_subtitle_text = function(e) {
  // event.stopPropagation();
  if(e.target.parentNode.parentNode.classList.contains('sel_row')) {
    // remove selection
    // this.remove_subtitle_sel();
    // e.target.blur();
    // this.inform_temporal_segmenter_of_unselect();
  } else {
    var mid = e.target.dataset.mid;
    var mindex = this.mid_list.indexOf(mid);
    this.remove_subtitle_sel();
    this.subtitle_sel(mindex);
    this.inform_temporal_segmenter_of_select();
  }
}

_via_subtitle_editor.prototype.onchange_subtitle_text = function(e) {
  var mid = e.target.dataset.mid;
  var new_subtitle_text = e.target.value.trim();
  // show selcted in seperate text field
  var selected_gloss_element = document.getElementById('selected_gloss_' + mid);
  selected_gloss_element.innerText = new_subtitle_text
  var input_element = document.getElementById('input_' + mid);
  input_element.value = "";
  this.d.metadata_update_av(this.ts.vid, mid, this.groupby_aid, new_subtitle_text).then( function(ok) {
    // update subtitle track cue
    var mindex = this.mid_list.indexOf(mid);
    var cue = this.subtitle_track_cue_list[mindex];
    cue.text = this.d.store.metadata[mid]['av'][this.groupby_aid];

    // update temporal segmenter
    this.ts._tmetadata_group_gid_draw(this.ts.selected_gid);
  }.bind(this), function(err) {
    _via_util_msg_show('Failed to update subtitle text.');
  }.bind(this));
}

_via_subtitle_editor.prototype.init_checkbox_RH = function(mid) {
  var _this = this
  _this.d_RH.metadata_add_bulk([_this.d.store.metadata[mid]], true, [mid])
  _this.d_RH.store.metadata[mid].checkbox = true
}

_via_subtitle_editor.prototype.onchange_checkbox_RH = function(e) {
  // debugger;
  var mid = e.target.dataset.mid;
  if (e.target.checked) {
    console.log("Checkbox is checked..");
    this.d_RH.metadata_add_bulk([this.d.store.metadata[mid]], true, [mid])
    this.d_RH.store.metadata[mid].checkbox = true
  } else {
    console.log("Checkbox is not checked..");
    this.d_RH.metadata_delete(this.ts.vid, mid)
  }
}

_via_subtitle_editor.prototype.init_checkbox_LH = function(mid) {

  this.d_LH.metadata_add_bulk([this.d.store.metadata[mid]], true, [mid])
  this.d_LH.store.metadata[mid].checkbox = true

}
_via_subtitle_editor.prototype.onchange_checkbox_LH = function(e) {
  debugger;
  var mid = e.target.dataset.mid;
  if (e.target.checked) {
    console.log("Checkbox is checked..");
    this.d_LH.metadata_add_bulk([this.d.store.metadata[mid]], true, [mid])
    this.d_LH.store.metadata[mid].checkbox = true
  } else {
    console.log("Checkbox is not checked..");
    this.d_LH.metadata_delete(this.ts.vid, mid)
  }
}

_via_subtitle_editor.prototype.remove_subtitle_sel = function() {
  if(this.selected_mindex !== -1) {
    // remove existing selection
    var old_row = document.getElementById('subtitle_mindex_' + this.selected_mindex);
    old_row.classList.remove('sel_row');
    this.selected_mindex = -1;
  }
}

_via_subtitle_editor.prototype.subtitle_sel = function(mindex) {
  new Date()
  this.d.log.push(Date.now()+ ':  clicked:' + mindex )
  this.selected_mindex = mindex;
  var new_row = document.getElementById('subtitle_mindex_' + this.selected_mindex);
  new_row.classList.add('sel_row');
  var scrolltop = new_row.parentNode.parentNode.parentNode.scrollTop;
  var vheight = new_row.parentNode.parentNode.parentNode.clientHeight;
  var row_height = new_row.clientHeight;
  var rowtop = new_row.offsetTop;
  if( (rowtop + row_height) < scrolltop ||
      (rowtop + row_height) > (scrolltop + vheight) ) {
    new_row.scrollIntoView();
  }
}

_via_subtitle_editor.prototype.inform_temporal_segmenter_of_select = function() {
  var mid = this.mid_list[this.selected_mindex];
  var tstart = this.d.store.metadata[mid].z[0];
  var ts_mindex = this.ts._tmetadata_get_mindex(mid);
  if(ts_mindex === -1) {
    this.ts._tmetadata_boundary_move(0, tstart);
    this.ts._tmetadata_gtimeline_draw();
    this.ts._tmetadata_group_gid_draw_all();
    ts_mindex = this.ts._tmetadata_get_mindex(mid);
    this.ts._tmetadata_group_gid_sel_metadata(ts_mindex, false);
  } else {
    this.ts._tmetadata_group_gid_sel_metadata(ts_mindex, false);
  }
  this.ts._tmetadata_group_gid_draw_all();
}

_via_subtitle_editor.prototype.inform_temporal_segmenter_of_unselect = function() {
  this.ts._tmetadata_group_gid_remove_mid_sel();
  this.ts._tmetadata_group_gid_draw_all();
}

_via_subtitle_editor.prototype.on_click_row = function(mindex, e) {
  console.log('clicked ' + mindex + ', target=' + e.target.type)
  if(e.target.type === 'text') {
    return; // handled by onclick_subtitle_text()
  }

  if(mindex === this.selected_mindex) {
    this.remove_subtitle_sel();
    this.inform_temporal_segmenter_of_unselect();
  } else {
    this.remove_subtitle_sel();
    this.subtitle_sel(mindex);
    this.inform_temporal_segmenter_of_select();
  }
}

_via_subtitle_editor.prototype.on_event_metadata_add = function(data, event_payload) {
  this.init();
}

_via_subtitle_editor.prototype.on_event_metadata_del = function(data, event_payload) {
  this.init();
}

_via_subtitle_editor.prototype._on_event_metadata_select = function(data, event_payload) {
  var mid = event_payload.mid;
  var mindex = this.mid_list.indexOf(mid);
  this.remove_subtitle_sel();
  this.subtitle_sel(mindex);
}

_via_subtitle_editor.prototype._on_event_metadata_unselect = function(data, event_payload) {
  this.remove_subtitle_sel();
}

_via_subtitle_editor.prototype._on_event_metadata_update = function(data, event_payload) {
  var mid = event_payload.mid;
  var eindex = event_payload.eindex;
  var mindex = this.mid_list.indexOf(mid);

  // update subtitle list
  var row = document.getElementById('subtitle_mindex_' + mindex);
  var stime = document.createElement('td');
  var start = _via_seconds_to_hh_mm_ss_ms(this.d.store.metadata[mid]['z'][0]);
  row.childNodes[1].innerHTML = '<span class="hhmmss">' + start[0] + ':' + start[1] + ':' + start[2] + '</span><span class="ms">' + start[3] + '</span>';
  var etime = document.createElement('td');
  var end = _via_seconds_to_hh_mm_ss_ms(this.d.store.metadata[mid]['z'][1]);
  row.childNodes[2].innerHTML = '<span class="hhmmss">' + end[0] + ':' + end[1] + ':' + end[2] + '</span><span class="ms">' + end[3] + '</span>';
  row.childNodes[3].innerHTML = this.d.store.metadata[mid]['av'][this.groupby_aid];

  // update subtitle track cue
  var cue = this.subtitle_track_cue_list[mindex];
  cue.startTime = this.d.store.metadata[mid]['z'][0];
  cue.endTime = this.d.store.metadata[mid]['z'][1];
  cue.text = this.d.store.metadata[mid]['av'][this.groupby_aid];
}

_via_subtitle_editor.prototype._compare_mid_by_time = function(mid1, mid2) {
  var t00 = this.d.store.metadata[mid1].z[0];
  var t10 = this.d.store.metadata[mid2].z[0];
  var t01 = this.d.store.metadata[mid1].z[1];
  var t11 = this.d.store.metadata[mid2].z[1];

  if ( typeof(t00) === 'string' ||
       typeof(t01) === 'string' ) {
    t00 = parseFloat(t00);
    t01 = parseFloat(t01);
    t10 = parseFloat(t10);
    t11 = parseFloat(t11);
  }

  if ( (t00 === t10) && ( t01 === t11 ) ) {
    return 0;
  }

  if ( ( t00 === t10 ) || ( t01 === t11 ) ) {
    var a,b;
    if ( ( t00 === t10 ) ) {
      // same start time
      a = t01;
      b = t11;
    } else {
      // same end time
      a = t00;
      b = t10;
    }
    if ( a < b ) {
      return -1;
    } else {
      return 1;
    }
  } else {
    if ( (t00 < t10) || ( t01 < t11 ) ) {
      return -1;
    } else {
      return 1;
    }
  }
}