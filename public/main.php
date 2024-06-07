<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="output.css">
    <link rel="stylesheet" href="../node_modules/@fortawesome/fontawesome-free/css/all.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

    <title>Document</title>
</head>

<body class=" bg-white overflow-hidden">
    <div class="h-[100vh] flex flex-col justify-between !w-[100vw]">
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
        <main class="hfull flex relative" id="Cargos">
            <div class="p-4 border-r max-w-64 flex-1 flex flex-col justify-between relative">
                <nav class="flex flex-col gap-4 text-gray-500">
                    <h3>Principal</h3>
                    <button class="text-left py-1 flex items-center gap-4  btn-nav"><i class="fa-solid fa-truck-ramp-box"></i>
                        <p>Cargos</p>
                    </button>
                </nav>
                <button class="h-12 bg-white border-t w-full flex items-center justify-between">
                    <p>Reduire le menu</p><i class="fa fa-arrow-circle-left w-6 text-gray-500" aria-hidden="true"></i>
                </button>
            </div>
            <div class="flex-1 p-12 py-12 gap-12 flex flex-col">
                <div class="flex justify-between items-center">
                    <h1 class="text-4xl font-extrabold">Cargos</h1>
                    <button id="createCargo" class="px-4 py-1 flex justify-center items-center rounded-full bg-gray-700 gap-2 text-white ">
                        <div class="bg-white w-4 h-4 flex items-center justify-center">
                            <i class="fa fa-plus text-gray-800" aria-hidden="true"></i>
                        </div>
                        <p>Add a Cargo</p>
                    </button>
                </div>
                <div>
                    <div class="flex gap-8">
                        <button class=" border-gray-900 pb-4 border-b">Cargos</button>
                    </div>
                    <hr class="px-8">
                </div>
                <div class="flex justify-between w-full">
                    <div class="flex gap-4">

                        <div class="border rounded-full p-2 flex items-center gap-2 border-black border-solid">
                            <i class="fa fa-search" aria-hidden="true"></i>
                            <input type="text" class="outline-none" placeholder="Quel cargo recherchez-vous?" id="filterAll">
                        </div>
                        <div class="border rounded-full px-2  flex items-center justify-center gap-2 border-black border-solid">
                            <select class="bg-transparent" id="filterType">
                                <option default>Type</option>
                                <option value="Aerial">Aerial</option>
                                <option value="Maritime">Maritime</option>
                                <option value="Road">Road</option>
                            </select>
                        </div>
                        <div class="border rounded-full px-2  flex items-center justify-center gap-2 border-black border-solid">
                            <select class="bg-transparent" id="filterStatus">
                                <option default>Status</option>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div class="border rounded-full px-2  flex items-center justify-center gap-2 border-black border-solid">
                            <select class="bg-transparent" id="filterStep">
                                <option default>Step</option>
                                <option value="Loading">Loading</option>
                                <option value="Transporting">Transporting</option>
                                <option value="Delivering">Delivering</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex justify-end w-full gap-4">
                        <button class="p-2 w-10 h-10 flex justify-center items-center rounded-full bg-gray-300" id="listView">
                            <i class="fa-solid fa-bars"></i>
                        </button>
                        <button class="p-2 w-10 h-10 flex justify-center items-center rounded-full bg-gray-300" id="cardView">
                            <i class="fa-solid fa-border-all"></i>
                        </button>
                    </div>
                </div>
                <div class="grid xl:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-5 overflow-scroll gap-4" id="cardContainer">
                </div>
                <div class="h-12 bg-white border-t absolute bottom-0 w-full">

                </div>

                <!-- slide Create Cargo -->
                <div class="w-3/5 h-[90%]  bg-gray-700 absolute -right-full rounded flex flex-col card transition-all duration-1000 z-40 my-auto" id="CreateCargo">
                    <div class="border-b h-14 flex flex-col justify-center p-8 text-white text-xl">
                        <h3>New Cargo</h3>
                    </div>
                    <div class="border-b flex justify-between">
                        <form id="formCargo" class="flex-1 p-8 text-gray-100 flex flex-col gap-6">
                            <div class="col" id="cargoType">
                                <label for="cargoType">Type of cargo: </label>
                                <select name="cargoType" class="p-2 text-slate-700 rounded">
                                    <option value="Aerial">Aerial</option>
                                    <option value="Maritime">Maritime</option>
                                    <option value="Road">Road</option>
                                </select>
                            </div>
                            <div class="col">
                                <label for="fullIndicator">Full indicator: </label>
                                <select name="fullIndicator" class="p-2 text-slate-700 rounded" id="fullIndicator">
                                    <option value="weight">Weight</option>
                                    <option value="nbrProduct">Number of Product</option>
                                </select>
                            </div>
                            <div class="col">
                                <label for="maxWeight" id="indicator">Max weigh in kg: </label>
                                <input type="number" name="maxWeight" placeholder="maxWeight " p-2">
                            </div>
                            <div class="flex justify-between">
                                <div class="flex flex-col gap-1">
                                    <label for="startingDate">Date debut:</label>
                                    <input type="date" name="startingDate" id="startingDate" />
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label for="endingDate">Date Fin:</label>
                                    <input type="date" name="endingDate" id="endingDate" />
                                </div>
                            </div>
                            <div class="col">
                                <div class="justify-between flex">
                                    <div>Depart:</div>
                                    <div>Arrive:</div>
                                </div>
                                <div class="justify-between flex gap-8" id="location">
                                    <div class="p-1 bg-green-400 rounded h-12" id="start"></div>
                                    <div class="p-1 bg-red-400 rounded h-12" id="end"></div>
                                </div>
                            </div>
                            <div>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvlZAIhDiuscetD-qqSOrhuNzPM4LgtsrDQtSgdMFi2famXXhXfMQdiTdZE-H-UxNObcI&usqp=CAU" class="h-32 w-full">
                            </div>

                        </form>
                        <div class="flex-1 border-l p-8" id="map"></div>
                    </div>
                    <div class="min-h-14 px-4 flex justify-end items-center">
                        <div class="text-center max-w-fit bg-blue-300 p-2 rounded-lg cursor-pointer" id="addCargo">
                            Create
                        </div>
                    </div>
                </div>
                <div class="inset-0 absolute w-full h-full bg-black bg-opacity-50 justify-center items-center hidden overlay z-10 transition-all duration-1000" id="hide">
                </div>


                <!-- slider view Cargo Details -->
                <div class="w-3/5 h-[70%]  bg-gray-700 absolute -right-full rounded flex flex-col card transition-all duration-1000 z-40" id="DetailCargo">
                    <div class="border-b h-14 flex flex-col justify-center p-8 text-white text-xl">
                        <h3>Detail Cargo</h3>
                    </div>
                    <div class="border-b flex-1 flex justify-between" id="cargoDetails">

                    </div>
                    <div class="h-14 px-4 flex justify-end items-center text-white">
                        <div class="col">
                            <div id="upgrade" class="text-center bg-green-400 max-w-fit p-2 rounded-lg cursor-pointer">
                                Start
                            </div>
                        </div>
                        <div class="hidden" id="markLost">
                            <div class="text-center w-32 p-2 rounded-lg cursor-pointer bg-red-400">
                                mark lost
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div class="inset-0 absolute w-full h-full bg-black bg-opacity-50 justify-center items-center hidden overlay z-10" onclick="hide()">
                </div> -->
                <div class="inset-0 absolute w-full h-full bg-black bg-opacity-50 justify-center items-center hidden overlay z-10" id="DetailOverlay" onclick="hideDetail()">
                </div>

            </div>

            <script type="module" src="./dist/index.js"></script>
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
            <script type="text/javascript" src="https://cdn.emailjs.com/dist/email.min.js"></script>
            <div class="h-full w-2 bg-slate-800  flex items-center justify-center absolute -right-0 transition-all duration-700" id="sliderAddProduct">
                <button class="py-12 px-1 bg-gray-300 rounded flex items-center justify-center text-white absolute -left-3" id="btnSliderAddProduct">
                    <i class="fa-solid fa-angles-left"></i>
                </button>
                <div class="h-full w-full flex-col justify-between hidden" id="addProductForm">
                    <div class="border-b h-14 flex flex-col justify-center p-8 text-white text-xl">
                        <h3>Add Product</h3>
                    </div>
                    <div class="px-8 flex  justify-center items-center">
                        <div class="items-center justify-center z-30 bg-black/65 rounded shadow-md" id="modalAddProduct">
                            <div class=" relative flex justify-center ">
                                <div class="px-8 py-20 w-1/3 bg-white col gap-4 rounded-l rounded-bl">
                                    <h1 class="bg-slate-900 p-2 text-center mb-4 text-white rounded font-semibold text-xl">
                                        Client information
                                    </h1>
                                    <form id="sender">
                                        <h3 class="text-xl font-bold mb-2">
                                            <i class="fa-solid fa-paper-plane"></i> Sender
                                        </h3>
                                        <div class="flex flex-col gap-2">
                                            <input type="text" name="clientPhone" id="clientPhone" placeholder="Phone number" />
                                            <div class="flex gap-4">
                                                <input type="text" class="w-1/2" name="clientName" id="clientName" placeholder="First name" />
                                                <input type="text" class="w-1/2" name="clientLastName" id="clientLastName" placeholder="Last name" />
                                            </div>
                                            <input type="text" name="clientAddress" id="clientAddress" placeholder="Address" />
                                        </div>
                                    </form>

                                    <form id="receiver">
                                        <h3 class="text-xl font-bold mb-2">
                                            <i class="fa fa-location-arrow" aria-hidden="true"></i> Receiver
                                        </h3>
                                        <div class="flex flex-col gap-2">
                                            <input type="text" name="receiverPhone" id="phone" placeholder="Phone number" />
                                            <div class="flex gap-4">
                                                <input type="text" class="w-1/2" name="receiverName" id="receiverName" placeholder="First name" />
                                                <input type="text" class="w-1/2" name="receiverLastName" id="receiverLastName" placeholder="Last name" />
                                            </div>
                                            <input type="text" name="receiverAddress" id="receiverAddress" placeholder="Address" />
                                        </div>
                                    </form>
                                    <div class="flex justify-center w-full left-0 absolute bottom-4 hover:text-teal-400 text-white">
                                        <button class="bg-slate-900 text-inherit px-8 py-2 rounded text-center flex gap-2 items-center" id="addProduct">
                                            <i class="fa-solid fa-floppy-disk text-inherit"></i> Save Product
                                        </button>
                                    </div>
                                </div>
                                <div class="bg-slate-900 text-white px-8 py-20 w-1/3 col gap-4 rounded-tr rounded-br">
                                    <h1 class="bg-white p-2 text-center mb-4 text-black rounded font-semibold text-xl">
                                        Product form
                                    </h1>
                                    <form id="productForm">
                                        <h3 class="text-xl font-bold mb-2">Product info</h3>
                                        <div class="flex flex-col gap-8">
                                            <input type="text" name="productName" placeholder="Product name" />
                                            <input type="number" name="weight" placeholder="Product weight" />
                                            <select name="productType" id="productType" class="p-3 bg-gray-600 rounded">

                                            </select>
                                            <div class="col h-[43px]" id="extra"></div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="h-14 px-8 flex justify-end items-center text-white">
                        <div class="col" id="Start">
                            <div class="text-center bg-green-400 max-w-fit p-2 rounded-lg cursor-pointer">
                                save and add another
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute w-fit px-4 items-center py-2 rounded bg-green-400 top-2 flex gap-2 -right-full transition-all duration-700 z-50" id="message">
                <p id="messageBody" class="text-white">cargo added successfully</p>
            </div>
            <div class="absolute h-screen bg-black/35 inset-0 hidden items-center justify-center" id="detailProduct">

            </div>
        </main>
    </div>
</body>

</html>

<!-- cardComponent -->
<!--  -->

<!-- BadgeComponent -->
<!-- <p class="px-2 py-1 bg-green-500 text-white rounded text-center">Aerial</p> -->

<!-- search element -->
<!-- <div class="border rounded-full p-2 flex items-center justify-center gap-2 border-black border-solid">
        <i class="fa fa-search" aria-hidden="true"></i>
        <input type="text" class="outline-none">
    </div> -->

<!-- select element -->
<!-- <div class="border rounded-full p-2 flex items-center justify-center gap-2 border-black border-solid">
        <select name="" id="" class="bg-transparent">
            <option value="">Aerial</option>
            <option value="">Sea</option>
            <option value="">Road</option>
        </select>
    </div> -->

<!-- rounded icon button  -->
<!-- <button class="p-2 w-10 h-10 flex justify-center items-center rounded-full bg-gray-300">
        <i class="fa fa-search" aria-hidden="true"></i>
    </button> -->

<!-- rounded text button -->
<!-- <button class="rounded-full border px-4 py-1 border-black border-solid">
        <p>content</p>
    </button> -->

<!-- tag -->
<!-- <div class="px-4 py-1 rounded-full bg-green-400 flex justify-between gap-2 text-white border">
        <p>Tag</p>
        <button>x</button>
    </div> -->

<!-- cargo row -->
<!-- <tr>
                <td>
                    <input type="checkbox" name="" id="">
                </td>
                <td>
                    Cargo 1
                </td>
                <td>Aerial</td>
                <td>49393</td>
                <td>13-01-2023</td>
                <td>13-01-2024</td>
                <td>Dakar</td>
                <td>Casablanca</td>
                <td><p class="px-2 py-1 bg-green-500 text-white rounded text-center">loading</p></td>
                <td class="text-center">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                </td>
            </tr> -->

<!-- sliders -->
<!-- <div class="w-3/5 h-[90%] bg-gray-700 absolute -right-full rounded flex flex-col card transition-all duration-300">
        <div class="border-b h-14"></div>
        <div class="border-b flex-1 px-8 flex justify-between">
            <div class="flex-1 p-4"></div>
            <div class="flex-1 border-l p-4"></div>
        </div>
        <div class="h-14 flex justify-end"></div>
    </div>
    <button onclick="show()"> 
        show
    </button>
    <script>
        function show() {
            document.querySelector('.card').classList.add('right-2')
            document.querySelector('.card').classList.remove('-right-full')
        }
    </script> -->

<!-- table -->
<!-- <table class="w-full">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Id</th>
                                <th>Type</th>
                                <th>Weight</th>
                                <th>Starting Date</th>
                                <th>Ending Date</th>
                                <th>Starting point</th>
                                <th>End point</th>
                                <th>Step</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="checkbox" name="" id="">
                                </td>
                                <td>
                                    Cargo 1
                                </td>
                                <td>Aerial</td>
                                <td>49393</td>
                                <td>13-01-2023</td>
                                <td>13-01-2024</td>
                                <td>Dakar</td>
                                <td>Casablanca</td>
                                <td>
                                    <p class="px-2 py-1 bg-green-500 text-white rounded text-center">loading</p>
                                </td>
                                <td class="text-center">
                                    <i class="fa fa-eye" aria-hidden="true"></i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="checkbox" name="" id="">
                                </td>
                                <td>
                                    Cargo 1
                                </td>
                                <td>Aerial</td>
                                <td>49393</td>
                                <td>13-01-2023</td>
                                <td>13-01-2024</td>
                                <td>Dakar</td>
                                <td>Casablanca</td>
                                <td>
                                    <p class="px-2 py-1 bg-green-500 text-white rounded text-center">loading</p>
                                </td>
                                <td class="text-center">
                                    <i class="fa fa-eye" aria-hidden="true"></i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="checkbox" name="" id="">
                                </td>
                                <td>
                                    Cargo 1
                                </td>
                                <td>Aerial</td>
                                <td>49393</td>
                                <td>13-01-2023</td>
                                <td>13-01-2024</td>
                                <td>Dakar</td>
                                <td>Casablanca</td>
                                <td>
                                    <p class="px-2 py-1 bg-green-500 text-white rounded text-center">loading</p>
                                </td>
                                <td class="text-center">
                                    <i class="fa fa-eye" aria-hidden="true"></i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="checkbox" name="" id="">
                                </td>
                                <td>
                                    Cargo 1
                                </td>
                                <td>Aerial</td>
                                <td>49393</td>
                                <td>13-01-2023</td>
                                <td>13-01-2024</td>
                                <td>Dakar</td>
                                <td>Casablanca</td>
                                <td>
                                    <p class="px-2 py-1 bg-green-500 text-white rounded text-center">loading</p>
                                </td>
                                <td class="text-center">
                                    <i class="fa fa-eye" aria-hidden="true"></i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="checkbox" name="" id="">
                                </td>
                                <td>
                                    Cargo 1
                                </td>
                                <td>Aerial</td>
                                <td>49393</td>
                                <td>13-01-2023</td>
                                <td>13-01-2024</td>
                                <td>Dakar</td>
                                <td>Casablanca</td>
                                <td>
                                    <p class="px-2 py-1 bg-green-500 text-white rounded text-center">loading</p>
                                </td>
                                <td class="text-center">
                                    <i class="fa fa-eye" aria-hidden="true"></i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input type="checkbox" name="" id="">
                                </td>
                                <td>
                                    Cargo 1
                                </td>
                                <td>Aerial</td>
                                <td>49393</td>
                                <td>13-01-2023</td>
                                <td>13-01-2024</td>
                                <td>Dakar</td>
                                <td>Casablanca</td>
                                <td>
                                    <p class="px-2 py-1 bg-green-500 text-white rounded text-center">loading</p>
                                </td>
                                <td class="text-center">
                                    <i class="fa fa-eye" aria-hidden="true"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex justify-end w-full gap-4 h-fit">
                        <button class="rounded-full border w-12 h-12 border-black border-solid">
                            <i class="fa fa-arrow-left" aria-hidden="true"></i>
                        </button>
                        <button class="rounded-full border w-12 h-12 border-black border-solid">
                            <i class="fa fa-arrow-right" aria-hidden="true"></i>
                        </button>
                    </div> -->