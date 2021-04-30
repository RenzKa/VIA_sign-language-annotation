/**
 *
 * @class
 * @classdesc Demo of video annotator
 * @author Abhishek Dutta <adutta@robots.ox.ac.uk>
 * @date 16 May 2019
 *
 * Video 1
 * Video title: The making of Alioli in 2 minutes using standard kitchen equipment
 * Video filename: Alioli_Wikimedia_Wardtmar.mp4
 * Video author: Wardtmar at https://commons.wikimedia.org
 * Video source: https://commons.wikimedia.org/wiki/File:Alioli.ogv
 * Video date: 2018-12-28 22:43:56
 *
 * Video 2
 * Video source: https://commons.wikimedia.org/wiki/File:Grilledcheesesandwich.webm
 */

function _via_load_submodules() {
  console.log('Loading video annotator demo');
  _via_demo_project = { 'store':{} };
  _via_demo_project['store'] = {};
  _via_demo_project['store']['project'] = {
    'pid': '__VIA_PROJECT_ID__',
    'rev': '__VIA_PROJECT_REV_ID__',
    'rev_timestamp': '__VIA_PROJECT_REV_TIMESTAMP__',
    'pname': 'Demo Video Annotation',
    'creator': 'VGG Image Annotator (http://www.robots.ox.ac.uk/~vgg/software/via)',
    'created': Date.now(),
    'data_format_version': '3.1.1',
    'vid_list':['1', '2'],
  };
  _via_demo_project['store']['config'] = {
    'file': {
      'loc_prefix': { '1':'', '2':'', '3':'', '4':'' }, // constants defined in _via_file._VIA_FILE_LOC
    },
    'ui': {
      'file_content_align':'center'
    }
  };
  _via_demo_project['store']['attribute'] = {
    '1': {
      'aname':'Activity',
      'anchor_id':'FILE1_Z2_XY0',
      'type':1,
      'desc':'Activity',
      'options':{},
      'default_option_id':'',
    },
    '5': {
      'aname':'Phase',
      'anchor_id':'FILE1_Z2_XY0',
      'type':1,
      'desc':'Phase of the Activity (e.g. start, middle, end)',
      'options':{},
      'default_option_id':'',
    },
    '2': {
      'aname':'Object',
      'anchor_id':'FILE1_Z1_XY1',
      'type':4,
      'desc':'Name of Object',
      'options':{
        '1':'Egg',
        '2':'Bottle',
        '3':'Mixer',
        '4':'Cup',
        '5':'Garlic',
        '6':'Knife',
        '7':'Tea Bag',
      },
      'default_option_id':'',
    },
    '3': {
      'aname':'Type',
      'anchor_id':'FILE1_Z1_XY1',
      'type':3,
      'desc':'Type of Object',
      'options':{
        '1':'Ingredient',
        '2':'Tool',
        '3':'Unknown',
      },
      'default_option_id':'3',
    },
  };
  _via_demo_project['store']['file'] = {
    '1':{
      'fid':1,
      'fname':_via_demo_data['video'][0]['filename'],
      'type':4,
      'loc':4,
      'src':_via_demo_data['video'][0]['src'],
    },
    '2':{
      'fid':2,
      'fname':'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/89/Grilledcheesesandwich.webm/Grilledcheesesandwich.webm.360p.webm',
      'type':4,
      'loc':2,
      'src':'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/89/Grilledcheesesandwich.webm/Grilledcheesesandwich.webm.360p.webm',
    },
  };

  _via_demo_project['store']['view'] = {
    '1': {
      'fid_list':[1],
    },
    '2': {
      'fid_list':[2],
    },
  };

  _via_demo_project['store']['metadata'] = {
    '-glfwaaX': {
      'vid': '1',
      'flg': 0,
      'z': [2, 6.5],
      'xy': [],
      'av': {
        '1':'1. break egg',
      }
    },
    '+mHHT-tg': {
      'vid': '1',
      'flg': 0,
      'z': [9, 20],
      'xy': [],
      'av': {
        '1':'2. pour liquid',
      }
    },
    'ed+wsOZZ': {
      'vid': '1',
      'flg': 0,
      'z': [24, 26],
      'xy': [],
      'av': {
        '1':'2. pour liquid',
      }
    },
    'mxCVj1qz': {
      'vid': '1',
      'flg': 0,
      'z': [32, 63],
      'xy': [],
      'av': {
        '1':'3. cut garlic',
      }
    },
    'kHRoMie1': {
      'vid': '1',
      'flg': 0,
      'z': [64, 128],
      'xy': [],
      'av': {
        '1':'4. mix',
      }
    },
    'fH-oMre1': {
      'vid': '1',
      'flg': 0,
      'z': [0.917],
      'xy': [4, 263, 184, 17, 13],
      'av': {
        '2':'1',
        '3':'1',
      }
    },
    'vPao-re8': {
      'vid': '1',
      'flg': 0,
      'z': [0.917],
      'xy': [2, 343, 730, 60, 160],
      'av': {
        '2':'2',
        '3':'1',
      }
    },
    'x-PoM9ea': {
      'vid': '1',
      'flg': 0,
      'z': [0.917],
      'xy': [7, 225, 133, 177, 177, 195, 188, 246, 138],
      'av': {
        '2':'6',
        '3':'2',
      }
    },
    'mR8ks-Aa': {
      'vid': '1',
      'flg': 0,
      'z': [7.208],
      'xy': [4, 328, 110, 25, 21],
      'av': {
        '2':'1',
        '3':'1',
      }
    },
    'Yh7Klow6': {
      'vid': '1',
      'flg': 0,
      'z': [21.52],
      'xy': [2, 315, 52, 80, 155],
      'av': {
        '2':'2',
        '3':'1',
      }
    },
    'A7jfx8PX': {
      'vid': '2',
      'flg': 0,
      'z': [2, 7],
      'xy': [],
      'av': {
        '1':'1. Heat Pan',
      }
    },
    'M8kl0+Xe': {
      'vid': '2',
      'flg': 0,
      'z': [8, 23],
      'xy': [],
      'av': {
        '1':'2. Spread butter',
      }
    },
    'yp-X6Hjy': {
      'vid': '2',
      'flg': 0,
      'z': [24, 27],
      'xy': [],
      'av': {
        '1':'3. Roast Bread',
      }
    },
  };
  this.d.store = _via_demo_project['store'];
  this.d._cache_update();
  this.vm._init();

  setTimeout( function() {
    this.va.view_show('1');
    if ( this.s ) {
      this.s._disable_share();
    }

    //this.editor.show();
  }.bind(this), 500);
}
