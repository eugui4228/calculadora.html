
document.addEventListener('DOMContentLoaded', function() {

    if (typeof pressButton === 'function') {
        console.log('Iniciando script de integração e teste');
        

        const display = document.getElementById('display');
        const calculatorImage = document.querySelector('.calculator-image');
        
        if (display && calculatorImage) {

            calculatorImage.onload = function() {
                const imgWidth = calculatorImage.offsetWidth;
                const imgHeight = calculatorImage.offsetHeight;
          
                display.style.width = (imgWidth * 0.9) + 'px';
                display.style.top = '20px';
                display.style.left = '50%';
                display.style.transform = 'translateX(-50%)';
                display.style.fontSize = '24px';
                display.style.padding = '8px';
                
                console.log('Visor da calculadora ajustado para dimensões da imagem');
            };
        }
        

        const originalPressButton = pressButton;
        pressButton = function(value) {

            const areas = document.querySelectorAll('area');
            let pressedArea = null;
            
            areas.forEach(area => {
                const alt = area.getAttribute('alt').toLowerCase();
                if (alt === value || 
                    (alt === 'x' && value === '*') ||
                    (alt === '√' && value === 'sqrt') ||
                    (alt === 'c' && value === 'c')) {
                    pressedArea = area;
                }
            });
            

            if (pressedArea) {
                const coords = pressedArea.getAttribute('coords').split(',');
                const x1 = parseInt(coords[0]);
                const y1 = parseInt(coords[1]);
                const x2 = parseInt(coords[2]);
                const y2 = parseInt(coords[3]);
                
                const buttonEffect = document.createElement('div');
                buttonEffect.style.position = 'absolute';
                buttonEffect.style.left = x1 + 'px';
                buttonEffect.style.top = y1 + 'px';
                buttonEffect.style.width = (x2 - x1) + 'px';
                buttonEffect.style.height = (y2 - y1) + 'px';
                buttonEffect.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                buttonEffect.style.borderRadius = '5px';
                buttonEffect.style.pointerEvents = 'none';
                buttonEffect.style.transition = 'opacity 0.2s';
                
                document.querySelector('.calculator-image-container').appendChild(buttonEffect);
                

                setTimeout(() => {
                    buttonEffect.style.opacity = '0';
                    setTimeout(() => {
                        buttonEffect.remove();
                    }, 200);
                }, 100);
            }
            

            originalPressButton(value);
        };
        

        const map = document.querySelector('map[name="calculator-map"]');
        if (map) {
            const areas = map.querySelectorAll('area');
            console.log(`Verificação de mapeamento: ${areas.length} áreas clicáveis configuradas`);
            

            const requiredButtons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', 'x', '/', '.', '√', '%', '=', 'c'];
            const mappedButtons = Array.from(areas).map(area => area.getAttribute('alt'));
            
            const missingButtons = requiredButtons.filter(btn => !mappedButtons.includes(btn));
            if (missingButtons.length > 0) {
                console.error(`Atenção: Botões não mapeados: ${missingButtons.join(', ')}`);
            } else {
                console.log('Todos os botões necessários estão mapeados corretamente');
            }
        }
        

        const messageArea = document.getElementById('message-area');
        if (messageArea) {
            messageArea.textContent = 'Calculadora pronta para uso! Clique em Iniciar para começar.';
        }
        
        console.log('Script de integração e teste aplicado com sucesso');
    } else {
        console.error('Script principal não detectado. O script de integração não foi aplicado.');
    }
});
