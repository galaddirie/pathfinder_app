from json import encoder
import typing
import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import pathfinder
from pathfinder.algorithms.Nodes import Node
from pathfinder.algorithms.dijkstra import Graph, PrioritizedItem
from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie
# Create your views here.
import sys


def dispatch(algo, g, nodes):
    dispatcher = {
        'astar': lambda nodes: g.a_star(nodes[0], nodes[1]),
        'dijkstra': lambda nodes: g.dijkstra(nodes[0], nodes[1]),
        'greedyBfs': lambda nodes: g.greedy_bfs(nodes[0], nodes[1]),
    }
    return dispatcher[algo](nodes)


@ensure_csrf_cookie
def home(request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    request_csrf_token = request.META.get('HTTP_X_CSRFTOKEN', '')
    # print(request_csrf_token)
    result = request.POST.get('result', None)

    print(sys.getsizeof(result))
    start = request.POST.get('start', None)
    end = request.POST.get('end', None)
    algo = request.POST.get('algoType', None)
    if is_ajax:
        # data from dijkstra goes here
        start = start.split(',')
        end = end.split(',')
        start_y, start_x = int(start[0]), int(start[1])
        end_y, end_x = int(end[0]), int(end[1])

        g = Graph(json.loads(result))
        start_node = g.nodes[start_y][start_x]
        end_node = g.nodes[end_y][end_x]

        visited = dispatch(algo, g, [start_node, end_node])

        path = g.get_paths(end_node)

        acc = []
        for node in visited:
            loc = node.id()
            acc.append(loc)
            if node == end_node:
                break

        acc2 = []
        for node in path:
            target = node.id()
            acc2.append(target)
        print(sys.getsizeof(acc))
        return JsonResponse({'visited': acc, 'path': acc2})
    return render(request, 'pathfinder/home.html', context={'data': result})


def test(request):
    return HttpResponse('hello')
