import './sass/app.scss';
import './ui/components/app-bar.js';
import './ui/components/photo-list.js';
import events from './ui/events.js';

import 'bootstrap/js/src/collapse.js';
import 'bootstrap/js/src/alert.js';
import $ from 'jquery';
import axios from 'axios';

const API = {
  key: 't0MZupgNiqYbVdR8Jn5S9LqCMgpD7esBgS1k9IUW',
  url: 'https://api.nasa.gov/mars-photos/api/v1/rovers',
  params: {
    camera: null,
    rover: 'curiosity',
    sol: 1
  }
};

const setupAccordionFilter = () => {
  $('.rover-cam').each(function() {
    $(this).on('click', function() {
      const rover = $(this).parents('.accordion-collapse').attr('id');
      const camera = $(this).attr('data-abbr');

      window.dispatchEvent(new CustomEvent(events.CAMERA_SELECTION_CHANGE, {
        detail: {
          rover,
          camera
        }
      }));

      $('.rover-cam').each(function() { $(this).removeClass('active'); });
      $(this).addClass('active');
    });
  });

  $('.accordion-button').each(function() {
    $(this).on('click', function() {
      $( $(this).attr('data-bs-target') ).find('[data-abbr=""]').click();
    });
  });

  // Fire on load
  $('.rover-cam.active').click();
};

const fetchImages = () => {
  const urlFrags = [`${API.url}/${API.params.rover}/photos?api_key=${API.key}`];

  $('photo-list').attr('loading', 'true');

  Object.keys(API.params).forEach((param) => {
    const paramValue = API.params[param];
    if (paramValue && param !== 'rover') {
      urlFrags.push(`&${param}=${paramValue}`);
    }
  });

  axios.get(urlFrags.join(''))
    .then(response => {
      $('photo-list').attr('loading', '');
      $('photo-list').attr('photos', JSON.stringify(response.data.photos));
    }).catch(e => {
      showConfirm(`Failed to fetch images (${e}). Retry?`, 'danger').then(fetchImages);
    });
};

const showConfirm = (message, variant='success') => {
  $('#alerts').html(`
    <div class="alert alert-${variant} fade show d-flex justify-content-between align-items-center" id="info-alert">
      ${message}
      <button id="close-button" class="btn btn-text ms-auto" data-bs-dismiss="alert" data-bs-target="info-alert">Close</button>
      <button id="confirm-button" class="btn btn-primary ms-2 me-0" data-bs-dismiss="alert" data-bs-target="info-alert">Confirm</button>
    </div>
  `);

  return new Promise((resolve, reject) => {
    $('#alerts').find('#confirm-button').on('click', resolve);
    $('#alerts').find('#close-button').on('click', reject);
  });
};

const main = () => {
  $(window).on(events.CAMERA_SELECTION_CHANGE, e => {
    API.params.camera = e.detail.camera;
    API.params.rover = e.detail.rover;

    fetchImages();
  });

  $('photo-list').on(events.SOL_INPUT_CHANGE, e => {
    API.params.sol = e.detail.value;

    fetchImages();
  });

  setupAccordionFilter();
};

$(window).on('DOMContentLoaded', main);
