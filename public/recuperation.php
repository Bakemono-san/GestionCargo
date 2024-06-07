<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="output.css">
    <link rel="stylesheet" href="../node_modules/@fortawesome/fontawesome-free/css/all.css" />
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />

    <title>Document</title>

<body class="bg-gray-100 min-h-screen flex flex-col items-center">
    <h1 class="p-4 text-2xl font-bold text-gray-700">Recuperation de coli <i class="fa-solid fa-box"></i></h1>
    <div class="container p-4">
        <div class="flex justify-center mb-4">
            <input id="findProduct" type="text" placeholder="Enter Product ID" class="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
        </div>
        <div id="detail" class="space-y-6"></div>
    </div>
    <script type="module" src="./dist/detail.js"></script>
</body>

</html>