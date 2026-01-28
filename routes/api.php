<?php
    try{
        header('Content-Type: application/json');

        function apiSummon($apiUrl){

            $ch = curl_init($apiUrl);
            // Tiene que llamar a la url q hemos construido previamente
            curl_setopt($ch, CURLOPT_URL, $apiUrl); 
            // Le decimos que nos devuelva la respuesta, no imprimir 
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            // Le enviamos las cabeceras
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Accept: application/json'
            ]);
            
            $response = curl_exec($ch);

            if(curl_errno($ch)){
                // Devolver error en json
                echo json_encode(['error' => curl_error($ch)]);
                curl_close($ch);
                exit;
            }

            $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if($statusCode == 200){
                $data = json_decode($response, true);
                return $data;
            } else {
                echo json_encode(['error' => 'Error en API externa', 'status' => $statusCode]);
            }

        }
        // Lista de provincias
        $provincias = ['León', 'Salamanca', 'Burgos', 'Ávila', 'Soria', 'Segovia', 'Palencia','Valladolid','Zamora'];
        $allData = [];
        foreach ($provincias as $provincia){
            $apiUrl = 'https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/registro-de-turismo-de-castilla-y-leon/records?where=provincia%20%3D%20%27' . urldecode($provincia) . '%27&limit=20&refine=establecimiento%3A%22Campings%22';
            $data = apiSummon($apiUrl);
            if(isset($data['results'])){
                $allData = array_merge($allData, $data['results']);
            }
        }
        //$apiUrlTesting = 'https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/registro-de-turismo-de-castilla-y-leon/records?select=*&where=provincia%20%3D%20%27Salamanca%27&limit=100&refine=establecimiento%3A%22Campings%22';
        //var_dump(apiSummon($apiUrlTesting));
        json_encode($allData);
        var_dump($allData);

    }catch(Exception $e){
        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json');
    }

    


?>