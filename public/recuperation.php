<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="output.css">
    <link rel="stylesheet" href="../node_modules/@fortawesome/fontawesome-free/css/all.css" />
    <title>Document</title> 

<body>
    <header class="px-8 py-4 bg-white w-full flex justify-between items-center border-b border-gray-300">
        <div class="flex flex-1 gap-16 items-center">
            <div>
                <p>Cargo du Monde</p>
            </div>
            <div class="flex flex-1 flex-end gap-6">
                <div class="border rounded-full p-2 flex items-center w-full gap-2 border-black border-solid">
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <input type="text" class="outline-none w-full" placeholder="Que cherchez vous?">
                </div>
                <div class="flex gap-3">

                    <div>

                        <button class="p-2 w-10 h-10 flex justify-center items-center rounded-full bg-gray-300">
                            <i class="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div>

                        <button class="p-2 w-10 h-10 flex justify-center items-center rounded-full bg-gray-300">
                            <i class="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-1 flex justify-end items-center gap-2 w-24">
            <button class="p-2 w-10 h-10 flex justify-center items-center rounded-full bg-gray-300">
                <i class="fa fa-question" aria-hidden="true"></i>
            </button>
            <button class="p-2 w-10 h-10 flex justify-center items-center rounded-full bg-gray-300">
                <i class="fa-solid fa-gear"></i>
            </button>
            <button class="p-2 w-10 h-10 flex justify-center items-center rounded-full bg-gray-300">
                <i class="fa fa-bell" aria-hidden="true"></i>
            </button>
        </div>
    </header>
    <div class="h-[100vh] flex flex-col justify-between !w-[100vw]">
        <main class="hfull flex relative" id="Cargos">
            <div class="p-4 border-r max-w-64 flex-1 flex flex-col justify-between relative">
                <nav class="flex flex-col gap-4 text-gray-500">
                    <h3>Principal</h3>
                    <button class="text-left py-1 flex items-center gap-4  btn-nav"><i class="fa-solid fa-chart-simple"></i>
                        <p>Statistique</p>
                    </button>
                    <button class="text-left py-1 flex items-center gap-4  btn-nav"><i class="fa-solid fa-truck-ramp-box"></i>
                        <p>Cargos</p>
                    </button>
                    <button class="text-left py-1 flex items-center gap-4  btn-nav"><i class="fa-solid fa-box"></i>
                        <p>Products</p>
                    </button>
                </nav>
                <button class="h-12 bg-white border-t w-full flex items-center justify-between">
                    <p>Reduire le menu</p><i class="fa fa-arrow-circle-left w-6 text-gray-500" aria-hidden="true"></i>
                </button>
            </div>
            <div>
                <h1>Find your Product</h1>
                <div class="border rounded-full p-2 flex items-center justify-center gap-2 border-black border-solid">
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <input type="text" class="outline-none" id="findProduct">
                </div>
                <div class="border-b flex-1 flex w-full justify-between bg-slate-700" id="detail">

                    </div>
            </div>
        </main>
    </div>
    <script type="module" src="./dist/detail.js"></script>

</body>

</html>