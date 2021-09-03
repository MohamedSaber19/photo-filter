import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FaSave } from "react-icons/fa";
import PropTypes from "prop-types";
import "./styles.scss";

function ImagePreview({ uploadedImage }) {
  const { imgBase64, fileName } = uploadedImage;
  const initialFilterValues = {
    brightness: 0,
    saturation: 0,
    contrast: 0,
    hue: 0,
    blur: 0,
    sepia: false,
    vintage: false,
  };
  const [filterValues, setFilterValues] = useState(initialFilterValues);

  useEffect(() => {
    // Init canvas
    const canvas = new fabric.Canvas("canvas");
    const canvasWrapper = document.querySelector("#canvas-wrapper");
    const [width, height] = [
      canvasWrapper.offsetWidth,
      canvasWrapper.offsetHeight,
    ];

    // Setting the canvas size
    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.calcOffset();

    // Adding uploaded image
    fabric.Image.fromURL(imgBase64, (image) => {
      resetFilterValues();
      var oImg = image
        .set({ left: 0, top: 0, bottom: 0 })
        .scaleToHeight(canvasWrapper.offsetWidth)
        .scaleToWidth(canvasWrapper.offsetHeight)
        .setCoords();
      canvas.add(oImg);
      canvas.centerObject(oImg);

      // Create and register the filters in `filters` object
      const filters = {
        brightness: new fabric.Image.filters.Brightness(),
        saturation: new fabric.Image.filters.Saturation(),
        contrast: new fabric.Image.filters.Contrast(),
        hue: new fabric.Image.filters.HueRotation(),

        vintage: new fabric.Image.filters.Vintage(),
        sepia: new fabric.Image.filters.Sepia(),
        blur: new fabric.Image.filters.Blur(),
      };

      // - Brightness
      image.filters.push(filters.brightness);
      const brightnessInput = document.querySelector("#brightness");
      brightnessInput.oninput = () => {
        const value = parseFloat(brightnessInput.value);
        filters.brightness.brightness = value;
        image.applyFilters();
        canvas.renderAll();
      };

      // - Saturation
      image.filters.push(filters.saturation);
      const saturationInput = document.querySelector("#saturation");
      saturationInput.oninput = () => {
        const value = parseFloat(saturationInput.value);
        filters.saturation.saturation = value;
        image.applyFilters();
        canvas.renderAll();
      };

      // - Contrast
      image.filters.push(filters.contrast);
      const contrastInput = document.querySelector("#contrast");
      contrastInput.oninput = () => {
        const value = parseFloat(contrastInput.value);
        filters.contrast.contrast = value;
        image.applyFilters();
        canvas.renderAll();
      };

      // - Hue
      image.filters.push(filters.hue);
      const hueInput = document.querySelector("#hue");
      hueInput.oninput = () => {
        const value = parseFloat(hueInput.value);
        filters.hue.rotation = value;
        image.applyFilters();
        canvas.renderAll();
      };

      // - Blur
      image.filters.push(filters.blur);
      const blurInput = document.querySelector("#blur");
      blurInput.oninput = () => {
        const value = parseFloat(blurInput.value);
        filters.blur.blur = value;
        image.applyFilters();
        canvas.renderAll();
      };

      // - Sepia
      const sepiaInput = document.querySelector("#sepia");
      sepiaInput.oninput = (e) => {
        // toggling filter on/off
        if (e.target.checked) {
          image.filters.push(filters.sepia);
        } else {
          let index = findFilterIndex(image, "Sepia");
          if (index !== -1) {
            image.filters.splice(index, 1);
          }
        }
        image.applyFilters();
        canvas.renderAll();
      };

      // - Vintage
      const vintageInput = document.querySelector("#vintage");
      vintageInput.oninput = (e) => {
        // toggling filter on/off
        if (e.target.checked) {
          image.filters.push(filters.vintage);
        } else {
          let index = findFilterIndex(image, "Vintage");
          if (index !== -1) {
            image.filters.splice(index, 1);
          }
        }
        image.applyFilters();
        canvas.renderAll();
      };

      // Save Image
      const saveBtn = document.querySelector("#saveBtn");
      saveBtn.addEventListener(
        "click",
        function () {
          saveBtn.href = canvas.toDataURL();
          saveBtn.download = `edit-${fileName}`;
        },
        false
      );

      // On screen resize
      window.onresize = function (e) {
        // Update canvas size & image position
        const [width, height] = [
          canvasWrapper.offsetWidth,
          canvasWrapper.offsetHeight,
        ];
        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.calcOffset();
        image
          .set({ left: 0, top: 0, bottom: 0 })
          .scaleToHeight(canvasWrapper.offsetWidth)
          .scaleToWidth(canvasWrapper.offsetHeight)
          .setCoords();
        canvas.add(oImg);
        canvas.centerObject(oImg);
      };
    });
    /* eslint-disable-next-line */
  }, [uploadedImage]);

  /**
   * Handle filters' changes & update filterState.
   * @param {event} e Input change event.
   */
  const handleFilterChanges = (e) => {
    const value = parseFloat(e.target.value);
    const filter = e.target.id;
    const type = e.target.type;
    const isChecked = e.target.checked;

    setFilterValues((prevState) => ({
      ...prevState,
      [filter]: type === "checkbox" ? isChecked : value,
    }));
  };

  /**
   * Get filter index by it's name.
   * @param {object} object Canvas object.
   * @param {string} filterName Filter name.
   * @return {number}  filter index.
   */
  const findFilterIndex = (object, filterName) => {
    let filterIndex = object.filters.findIndex((f) => f.type === filterName);
    return filterIndex;
  };

  /**
   * Reset filter values to initial values.
   */
  const resetFilterValues = () => {
    setFilterValues(initialFilterValues);
  };

  return (
    <section className="image-preview">
      <div className="image-preview__canvas" id="canvas-wrapper">
        <canvas id="canvas" />
      </div>
      <div className="image-preview__filters">
        <div className="image-preview__filter-item">
          <label htmlFor="brightness">Brightness</label>
          <input
            type="range"
            id="brightness"
            value={filterValues.brightness}
            onChange={handleFilterChanges}
            min="0"
            max="1"
            step="0.05"
          />
          <span className="image-preview__filter-value">
            {filterValues.brightness * 100} %
          </span>
        </div>
        <div className="image-preview__filter-item">
          <label htmlFor="saturation">Saturation</label>
          <input
            type="range"
            id="saturation"
            value={filterValues.saturation}
            onChange={handleFilterChanges}
            min="0"
            max="1"
            step="0.05"
          />
          <span className="image-preview__filter-value">
            {filterValues.saturation * 100} %
          </span>
        </div>
        <div className="image-preview__filter-item">
          <label htmlFor="contrast">Contrast</label>
          <input
            type="range"
            id="contrast"
            value={filterValues.contrast}
            onChange={handleFilterChanges}
            min="0"
            max="1"
            step="0.05"
          />
          <span className="image-preview__filter-value">
            {filterValues.contrast * 100} %
          </span>
        </div>
        <div className="image-preview__filter-item">
          <label htmlFor="hue">Hue</label>
          <input
            type="range"
            id="hue"
            value={filterValues.hue}
            onChange={handleFilterChanges}
            min="0"
            max="1"
            step="0.05"
          />
          <span className="image-preview__filter-value">
            {filterValues.hue * 100} %
          </span>
        </div>
        <div className="image-preview__filter-item">
          <label htmlFor="blur">Blur</label>
          <input
            type="range"
            id="blur"
            value={filterValues.blur}
            onChange={handleFilterChanges}
            min="0"
            max="1"
            step="0.05"
          />
          <span className="image-preview__filter-value">
            {filterValues.blur * 100} %
          </span>
        </div>
        <div className="image-preview__filter-item image-preview__filter-item--checkbox">
          <label htmlFor="sepia">Sepia</label>
          <input
            type="checkbox"
            id="sepia"
            checked={filterValues.sepia}
            onChange={handleFilterChanges}
          />
        </div>
        <div className="image-preview__filter-item image-preview__filter-item--checkbox">
          <label htmlFor="vintage">Vintage</label>
          <input
            type="checkbox"
            id="vintage"
            checked={filterValues.vintage}
            onChange={handleFilterChanges}
          />
        </div>
        <div className="image-preview__actions">
          <a className="image-preview__action-item" href="/" id="saveBtn">
            <FaSave /> Save Image
          </a>
        </div>
      </div>
    </section>
  );
}

ImagePreview.propTypes = {
  uploadedImage: PropTypes.shape({
    imgBase64: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
  }),
};

export default ImagePreview;
