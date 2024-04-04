from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Message
from django.core.serializers import serialize
import json

# List all messages or create a new one
@require_http_methods(["GET", "POST"])
@csrf_exempt
def message_list_create(request):
    if request.method == 'GET':
        messages = Message.objects.all()
        messages_json = serialize('json', messages)
        messages_list = json.loads(messages_json)  # Convert JSON string back to a Python list
        return JsonResponse(messages_list, safe=False)  
    elif request.method == 'POST':
        data = json.loads(request.body)
        message = Message.objects.create(text=data['text'])
        return JsonResponse({'id': message.id, 'text': message.text})

# Delete a specific message
@require_http_methods(["DELETE"])
@csrf_exempt
def message_delete(request, pk):
    message = get_object_or_404(Message, pk=pk)
    message.delete()
    return HttpResponse(status=204)

# Get a specific message by ID
@require_http_methods(["GET"])
def message_detail(request, pk):
    message = get_object_or_404(Message, pk=pk)
    message_json = serialize('json', [message, ])
    message_dict = json.loads(message_json)  # Convert JSON string back to Python object
    return JsonResponse(message_dict, safe=False)  # 
