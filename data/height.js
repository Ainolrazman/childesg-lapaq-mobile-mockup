// data/height.js — WHO growth median reference vs. projected cohort trajectories.

export const heightData = {
    male: {
        labels: ['0y', '2y', '4y', '6y', '8y', '10y', '12y', '14y', '16y', '18y'],
        whoMedian:    [50, 87, 102, 115, 127, 138, 150, 162, 168, 171],
        currentDiet:  [50, 86, 100, 112, 122, 130, 140, 152, 158, 162],
        intervention: [50, 87, 101, 114, 125, 136, 148, 159, 166, 168],
        whoRef: 171,
        label: 'Male'
    },
    female: {
        labels: ['0y', '2y', '4y', '6y', '8y', '10y', '12y', '14y', '16y', '18y'],
        whoMedian:    [49, 86, 101, 114, 126, 137, 149, 155, 158, 159],
        currentDiet:  [49, 85, 98, 110, 120, 128, 138, 145, 148, 150],
        intervention: [49, 86, 100, 112, 123, 134, 146, 152, 155, 157],
        whoRef: 159,
        label: 'Female'
    }
};
