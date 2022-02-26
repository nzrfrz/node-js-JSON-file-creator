import { Dummy } from "./assets/dummy.js";
import * as fs from "fs";
import { readFile } from 'fs/promises';

const provinces = JSON.parse(await readFile(new URL('./assets/provinces.json', import.meta.url)));
const regencies = JSON.parse(await readFile(new URL('./assets/regencies.json', import.meta.url)));
const districts = JSON.parse(await readFile(new URL('./assets/districts.json', import.meta.url)));
const villages = JSON.parse(await readFile(new URL('./assets/villages.json', import.meta.url)));

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
};

const provincesState = [];
provinces.map((data) => {
    provincesState.push({
        // kode: data.kode + "p",
        kode: data.id,
        name: toTitleCase(data.name),
        keterangan: "Provinsi",
        latitude: data.latitude,
        longitude: data.longitude
    })
});

const regenciesState = [];
regencies.map((dataX) =>  {
    regenciesState.push({
        // kode: dataX.kode + "kk",
        kode: dataX.id,
        kodeProvinsi: dataX.province_id,
        name: toTitleCase(dataX.name),
        latitude: dataX.latitude,
        longitude: dataX.longitude,
        min: dataX.min,
        max: dataX.max,
        keterangan: "Provinsi" + " " + provinces.filter((dataY) => dataX.province_id === dataY.id).map((dataY) => toTitleCase(dataY.name)).toString()
    })
});

const districtsState = [];
districts.map((data) => {
    districtsState.push({
    kode: data.id,
    kodeKabupaten: data.regency_id,
    name: toTitleCase(data.name),
    latitude: data.latitude,
    longitude: data.longitude,
    min: data.min,
    max: data.max,
    keterangan: "Kabupaten/Kota" + " " + regencies.filter((dataY) => data.regency_id === dataY.id).map((dataY) => toTitleCase(dataY.name)).toString() + ", Provinsi" + " " + provinces.filter((dataY) => data.regency_id.slice(0, 2) === dataY.id).map((dataY) => toTitleCase(dataY.name)).toString()
  })
});

const villagesState = [];
villages.map((data) => {
    villagesState.push({
    // kode: data.kode + "kec",
    kode: data.id,
    kodeKecamatan: data.district_id,
    name: toTitleCase(data.name),
    latitude: Number(districts.filter((dataX) => data.district_id === dataX.id).map((dataY) => dataY.latitude)),
    longitude: Number(districts.filter((dataX) => data.district_id === dataX.id).map((dataY) => dataY.longitude)),
    min: data.min,
    max: data.max,
    keterangan: "Kecamatan" + " " + districts.filter((dataX) => data.district_id === dataX.id).map((dataY) => toTitleCase(dataY.name)).toString() + ", Kabupaten/Kota" + " " + regencies.filter((dataZ) => data.id.slice(0, 4) === dataZ.id).map((dataZX) => toTitleCase(dataZX.name)).toString() + ", Provinsi" + " " + provinces.filter((dataZY) => data.id.slice(0, 2) === dataZY.id).map((dataY) => toTitleCase(dataY.name)).toString()
  })
});

const listRegion = [];
listRegion.push(
    ...provincesState,
    ...regenciesState,
    ...districtsState,
    ...villagesState
);

fs.writeFile ("listAllGeo.json", JSON.stringify(listRegion), function(err) {
    if (err) throw err;
    console.log('complete');
    }
);

console.log(listRegion.map((data) => data).map((dataY) => dataY.namaProvinsi));